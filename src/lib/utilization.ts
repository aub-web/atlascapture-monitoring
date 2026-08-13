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

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function utilizationPercent(
  recordedHours: number,
  capacityHours: number,
): number | null {
  if (capacityHours <= 0) return null;
  return round1((recordedHours / capacityHours) * 100);
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
): UtilizationBucket[] {
  const buckets = new Map<number, UtilizationBucket>();

  for (const entry of entries) {
    const start = bucketStart(entry.date, period);
    const key = start.getTime();
    const hours = utilizationHoursForEntry(entry.deviceType, entry.deviceCount);
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

  return Array.from(buckets.values()).sort(
    (a, b) => b.start.getTime() - a.start.getTime(),
  );
}

export function totalUtilization(entries: UtilizationEntryLike[]): {
  monoHours: number;
  multicamHours: number;
  totalHours: number;
  recordedHours: number;
} {
  let monoHours = 0;
  let multicamHours = 0;
  let recordedHours = 0;
  for (const entry of entries) {
    const hours = utilizationHoursForEntry(entry.deviceType, entry.deviceCount);
    if (entry.deviceType === "MULTICAM") multicamHours += hours;
    else monoHours += hours;
    recordedHours += entry.recordedHours;
  }
  return {
    monoHours,
    multicamHours,
    totalHours: monoHours + multicamHours,
    recordedHours,
  };
}
