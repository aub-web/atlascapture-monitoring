// Device count per business, multiplied by a fixed hours-per-device figure,
// gives the capacity hours for that entry: 6h per Multicam device, 4h per
// Mono device. recordedHours is the actual hours logged that day, entered by
// the user — comparing the two gives a utilization percentage.
export const HOURS_PER_DEVICE: Record<string, number> = {
  MONO: 4,
  MULTICAM: 6,
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
  defectiveMonoCount: number;
  defectiveMulticamCount: number;
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
  monoHours: number;
  multicamHours: number;
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

export function groupUtilization(
  entries: UtilizationEntryLike[],
  period: UtilizationPeriod,
  effectiveDevices: Record<string, number> = {},
): UtilizationBucket[] {
  const buckets = new Map<number, UtilizationBucket>();

  for (const entry of entries) {
    const start = bucketStart(entry.date, period);
    const key = start.getTime();
    const hours = capacityHoursForDeviceType(effectiveDevices, entry.deviceType);
    const isMulticam = entry.deviceType === "MULTICAM";

    const existing = buckets.get(key);
    if (existing) {
      if (isMulticam) existing.multicamHours += hours;
      else existing.monoHours += hours;
      existing.totalHours += hours;
      existing.recordedHours += entry.recordedHours;
    } else {
      buckets.set(key, {
        label: bucketLabel(start, period),
        start,
        monoHours: isMulticam ? 0 : hours,
        multicamHours: isMulticam ? hours : 0,
        totalHours: hours,
        recordedHours: entry.recordedHours,
      });
    }
  }

  return Array.from(buckets.values())
    .map((bucket) => ({ ...bucket, recordedHours: round2(bucket.recordedHours) }))
    .sort((a, b) => b.start.getTime() - a.start.getTime());
}

export function totalUtilization(
  entries: UtilizationEntryLike[],
  effectiveDevices: Record<string, number> = {},
): {
  monoHours: number;
  multicamHours: number;
  totalHours: number;
  recordedHours: number;
} {
  let monoHours = 0;
  let multicamHours = 0;
  let recordedHours = 0;
  for (const entry of entries) {
    const hours = capacityHoursForDeviceType(effectiveDevices, entry.deviceType);
    if (entry.deviceType === "MULTICAM") multicamHours += hours;
    else monoHours += hours;
    recordedHours += entry.recordedHours;
  }
  return {
    monoHours,
    multicamHours,
    totalHours: monoHours + multicamHours,
    recordedHours: round2(recordedHours),
  };
}
