// Device count per business, multiplied by a fixed hours-per-device figure,
// gives the capacity hours for that entry: 6h per Multicam device, 4h per
// Mono iPhone, 6h per Mono Insta 360. recordedHours is the actual hours
// logged that day, entered by the user — comparing the two gives a
// utilization percentage.
export const HOURS_PER_DEVICE: Record<string, number> = {
  MONO: 4,
  MULTICAM: 6,
  MONO_INSTA360: 6,
};

export function utilizationHoursForEntry(
  deviceType: string,
  deviceCount: number,
): number {
  return deviceCount * (HOURS_PER_DEVICE[deviceType] ?? 0);
}

// Devices that are issued but currently defective don't count toward
// capacity.
export function effectiveDeviceCount(issued: number, defective: number): number {
  return Math.max(0, issued - defective);
}

export type BusinessDeviceCounts = {
  issuedMonoCount: number;
  issuedMulticamCount: number;
  issuedMonoInsta360Count: number;
  defectiveMonoCount: number;
  defectiveMulticamCount: number;
  defectiveMonoInsta360Count: number;
};

// Fixed, business-level device counts (issued minus defective), independent
// of whatever count is typed into any single utilization entry — this is
// what utilization capacity is measured against.
export function effectiveDevicesForBusiness(
  business: BusinessDeviceCounts,
): Record<string, number> {
  return {
    MONO: effectiveDeviceCount(business.issuedMonoCount, business.defectiveMonoCount),
    MULTICAM: effectiveDeviceCount(
      business.issuedMulticamCount,
      business.defectiveMulticamCount,
    ),
    MONO_INSTA360: effectiveDeviceCount(
      business.issuedMonoInsta360Count,
      business.defectiveMonoInsta360Count,
    ),
  };
}

export function capacityHoursForDeviceType(
  effectiveDevices: Record<string, number>,
  deviceType: string,
): number {
  return (effectiveDevices[deviceType] ?? 0) * (HOURS_PER_DEVICE[deviceType] ?? 0);
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

// Summing many already-rounded floats (e.g. recordedHours) drifts due to
// binary floating-point representation (0.1 + 0.2 !== 0.3) — round the total
// back to 2 decimals so it displays cleanly.
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// Deliberately Target ÷ Uploaded (not the more common Uploaded ÷ Target) —
// per the weekly utilization computation spec. A business right on target
// reads 100%; one that's under target reads above 100%, not below.
export function utilizationPercent(
  recordedHours: number,
  capacityHours: number,
): number | null {
  if (recordedHours <= 0) return null;
  return round1((capacityHours / recordedHours) * 100);
}

export type UtilizationAction = {
  label: string;
  className: string;
};

// Gap = actual recorded hours minus capacity (devices * target hrs/device).
// >= 0h: on or above target. -3h to 0h: mildly behind. Below -3h: needs a
// support visit.
export function actionForGap(gap: number): UtilizationAction {
  if (gap >= 0) {
    return { label: "Good", className: "bg-emerald-50 text-emerald-700" };
  }
  if (gap >= -3) {
    return { label: "Warning", className: "bg-amber-50 text-amber-700" };
  }
  return { label: "Support visit", className: "bg-red-50 text-red-700" };
}

export type UtilizationPeriod = "daily" | "weekly" | "monthly";

export type UtilizationEntryLike = {
  date: Date;
  deviceType: string;
  deviceCount: number;
  recordedHours: number;
};

export type UtilizationBucket = {
  label: string;
  start: Date;
  totalHours: number;
  recordedHours: number;
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Monday-based week.
function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const result = startOfDay(date);
  result.setDate(result.getDate() + diff);
  return result;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function bucketStart(date: Date, period: UtilizationPeriod): Date {
  if (period === "daily") return startOfDay(date);
  if (period === "weekly") return startOfWeek(date);
  return startOfMonth(date);
}

// The weekly target is a fixed 5 work days, per the spec, regardless of the
// calendar — a week with only one entry still carries the full 5-day target.
export const WORK_DAYS_PER_WEEK = 5;

// Monthly counts actual Mon-Sat days in that calendar month (Sunday is
// unpaid/off) — hours logged on a Sunday still count toward the recorded
// total, they just don't add to the baseline target.
function isWorkDay(date: Date): boolean {
  return date.getDay() !== 0; // Sunday = 0
}

function workDaysInMonth(monthStart: Date): number {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    if (isWorkDay(new Date(year, month, day))) count++;
  }
  return count;
}

// # of devices × hours/device × work days in the period = Target.
function workDaysForPeriod(period: UtilizationPeriod, start: Date): number {
  if (period === "daily") return 1;
  if (period === "weekly") return WORK_DAYS_PER_WEEK;
  return workDaysInMonth(start);
}

function bucketLabel(start: Date, period: UtilizationPeriod): string {
  if (period === "monthly") {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(start);
  }
  const formatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(start);
  return period === "weekly" ? `Week of ${formatted}` : formatted;
}

// Target for a bucket is fixed by the calendar period it covers (# of
// devices × hours/device × work days in that day/week/month), not by how
// many days within it actually have a logged entry — a week with only one
// entry still carries the full weekly target, so idle days show up as a
// shortfall rather than shrinking the goalpost.
export function groupUtilization(
  entries: UtilizationEntryLike[],
  period: UtilizationPeriod,
  effectiveDevices: Record<string, number> = {},
): UtilizationBucket[] {
  const drafts = new Map<
    number,
    { start: Date; recordedHours: number; types: Set<string> }
  >();

  for (const entry of entries) {
    const start = bucketStart(entry.date, period);
    const key = start.getTime();
    const draft = drafts.get(key);
    if (draft) {
      draft.recordedHours += entry.recordedHours;
      draft.types.add(entry.deviceType);
    } else {
      drafts.set(key, {
        start,
        recordedHours: entry.recordedHours,
        types: new Set([entry.deviceType]),
      });
    }
  }

  return Array.from(drafts.values())
    .map((draft) => {
      const days = workDaysForPeriod(period, draft.start);
      let totalHours = 0;
      for (const type of draft.types) {
        totalHours += capacityHoursForDeviceType(effectiveDevices, type) * days;
      }
      return {
        label: bucketLabel(draft.start, period),
        start: draft.start,
        totalHours,
        recordedHours: round2(draft.recordedHours),
      };
    })
    .sort((a, b) => b.start.getTime() - a.start.getTime());
}

// All-time total: each logged day contributes one day's worth of target
// (no fixed calendar period to apply a work-week multiplier to).
export function totalUtilization(
  entries: UtilizationEntryLike[],
  effectiveDevices: Record<string, number> = {},
): {
  totalHours: number;
  recordedHours: number;
} {
  let totalHours = 0;
  let recordedHours = 0;
  for (const entry of entries) {
    totalHours += capacityHoursForDeviceType(effectiveDevices, entry.deviceType);
    recordedHours += entry.recordedHours;
  }
  return {
    totalHours,
    recordedHours: round2(recordedHours),
  };
}
