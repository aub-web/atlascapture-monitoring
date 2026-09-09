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

export function capacityHoursForDeviceType(
  effectiveDevices: Record<string, number>,
  deviceType: string,
): number {
  return (effectiveDevices[deviceType] ?? 0) * (HOURS_PER_DEVICE[deviceType] ?? 0);
}

// A record of what issued/defective counts were in effect for one device
// type as of effectiveAt — see the DeviceCountSnapshot/SalesDeviceCountSnapshot
// Prisma models, written whenever DeviceAllocationCard saves a change.
export type DeviceSnapshot = {
  deviceType: string;
  issuedCount: number;
  defectiveCount: number;
  effectiveAt: Date;
};

// What was issued (minus defective) per device type as of `date` — the
// latest snapshot at or before that date, per type. Used so a historical
// period's target reflects what was actually issued then, not today's
// count (a business that ramped up from 4 to 18 devices shouldn't have
// last month's weeks judged against 18).
export function effectiveDevicesAt(
  snapshots: DeviceSnapshot[],
  date: Date,
): Record<string, number> {
  const latestByType = new Map<string, DeviceSnapshot>();
  for (const snapshot of snapshots) {
    if (snapshot.effectiveAt > date) continue;
    const current = latestByType.get(snapshot.deviceType);
    if (!current || snapshot.effectiveAt > current.effectiveAt) {
      latestByType.set(snapshot.deviceType, snapshot);
    }
  }
  const result: Record<string, number> = {};
  for (const [deviceType, snapshot] of latestByType) {
    result[deviceType] = effectiveDeviceCount(
      snapshot.issuedCount,
      snapshot.defectiveCount,
    );
  }
  return result;
}

// This business's fixed weekly target (summed across device types) as of
// the given week's start — see effectiveDevicesAt.
export function weeklyTargetHoursAt(
  snapshots: DeviceSnapshot[],
  weekStart: Date,
): number {
  const effective = effectiveDevicesAt(snapshots, weekStart);
  return Object.keys(effective).reduce(
    (sum, type) =>
      sum + capacityHoursForDeviceType(effective, type) * WORK_DAYS_PER_WEEK,
    0,
  );
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

// Uploaded ÷ Target: 100% = hit the target exactly, below 100% = short of
// it, above 100% = exceeded it.
export function utilizationPercent(
  recordedHours: number,
  capacityHours: number,
): number | null {
  if (capacityHours <= 0) return null;
  return round1((recordedHours / capacityHours) * 100);
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
// shortfall rather than shrinking the goalpost. The device count used is
// whatever was in effect (per effectiveDevicesAt) as of the bucket's start,
// so a business's device ramp-up over time doesn't retroactively inflate
// the target for weeks/months before it happened.
export function groupUtilization(
  entries: UtilizationEntryLike[],
  period: UtilizationPeriod,
  snapshots: DeviceSnapshot[] = [],
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
      const effectiveDevices = effectiveDevicesAt(snapshots, draft.start);
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
// (no fixed calendar period to apply a work-week multiplier to), based on
// whatever was issued as of that entry's own date.
export function totalUtilization(
  entries: UtilizationEntryLike[],
  snapshots: DeviceSnapshot[] = [],
): {
  totalHours: number;
  recordedHours: number;
} {
  let totalHours = 0;
  let recordedHours = 0;
  for (const entry of entries) {
    const effectiveDevices = effectiveDevicesAt(snapshots, entry.date);
    totalHours += capacityHoursForDeviceType(effectiveDevices, entry.deviceType);
    recordedHours += entry.recordedHours;
  }
  return {
    totalHours,
    recordedHours: round2(recordedHours),
  };
}
