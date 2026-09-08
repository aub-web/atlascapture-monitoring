// Sunday-Saturday week grouping and week-over-week comparisons, combining
// Outbound + Sales utilization entries per business ("team").

export type WeeklyEntry = {
  businessId: string;
  businessName: string;
  date: Date;
  deviceType: string;
  deviceCount: number;
  recordedHours: number;
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function dayOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function sundayStart(date: Date): Date {
  const d = dayOnly(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function formatWeekLabel(start: Date): string {
  const end = addDays(start, 6);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return `${fmt.format(start)}–${fmt.format(end)}`;
}

type ChangeStat = { changePercent: number | null; isNew: boolean };

function computeChange(current: number, previous: number): ChangeStat {
  if (previous === 0) {
    return current === 0 ? { changePercent: 0, isNew: false } : { changePercent: null, isNew: true };
  }
  return { changePercent: round1(((current - previous) / previous) * 100), isNew: false };
}

function sumHours(entries: WeeklyEntry[]): number {
  return round1(entries.reduce((sum, e) => sum + e.recordedHours, 0));
}

function groupSum<K extends string>(
  entries: WeeklyEntry[],
  keyFn: (e: WeeklyEntry) => K,
): Map<K, number> {
  const map = new Map<K, number>();
  for (const e of entries) {
    map.set(keyFn(e), (map.get(keyFn(e)) ?? 0) + e.recordedHours);
  }
  return map;
}

export type WeekOverWeekStat = {
  label: string;
  current: number;
  changePercent: number | null;
  isNew: boolean;
};

export type WeekOverWeek = {
  currentTotal: number;
  previousTotal: number;
  changePercent: number | null;
  isNew: boolean;
  currentRangeLabel: string;
  previousRangeLabel: string;
  byDeviceType: WeekOverWeekStat[];
  byBusiness: WeekOverWeekStat[];
};

// Anchored to the most recent entry date: compares the 7 days ending there
// to the 7 days before that.
export function weekOverWeek(entries: WeeklyEntry[]): WeekOverWeek | null {
  if (entries.length === 0) return null;

  const latest = entries.reduce(
    (max, e) => (e.date > max ? e.date : max),
    entries[0].date,
  );
  const currentEnd = dayOnly(latest);
  const currentStart = addDays(currentEnd, -6);
  const previousEnd = addDays(currentStart, -1);
  const previousStart = addDays(previousEnd, -6);

  function inRange(date: Date, start: Date, end: Date): boolean {
    const d = dayOnly(date);
    return d >= start && d <= end;
  }

  const currentEntries = entries.filter((e) =>
    inRange(e.date, currentStart, currentEnd),
  );
  const previousEntries = entries.filter((e) =>
    inRange(e.date, previousStart, previousEnd),
  );

  const currentTotal = sumHours(currentEntries);
  const previousTotal = sumHours(previousEntries);
  const totalChange = computeChange(currentTotal, previousTotal);

  const currentByType = groupSum(currentEntries, (e) => e.deviceType);
  const previousByType = groupSum(previousEntries, (e) => e.deviceType);
  const types = Array.from(
    new Set([...currentByType.keys(), ...previousByType.keys()]),
  );
  const byDeviceType = types
    .map((type) => {
      const current = round1(currentByType.get(type) ?? 0);
      const previous = round1(previousByType.get(type) ?? 0);
      return { label: type, current, ...computeChange(current, previous) };
    })
    .sort((a, b) => b.current - a.current);

  const currentByBiz = groupSum(currentEntries, (e) => e.businessId);
  const previousByBiz = groupSum(previousEntries, (e) => e.businessId);
  const bizNames = new Map(entries.map((e) => [e.businessId, e.businessName]));
  const bizIds = Array.from(
    new Set([...currentByBiz.keys(), ...previousByBiz.keys()]),
  );
  const byBusiness = bizIds
    .map((id) => {
      const current = round1(currentByBiz.get(id) ?? 0);
      const previous = round1(previousByBiz.get(id) ?? 0);
      return {
        label: bizNames.get(id) ?? id,
        current,
        ...computeChange(current, previous),
      };
    })
    .filter((b) => b.current > 0 || b.changePercent !== null || b.isNew)
    .sort((a, b) => b.current - a.current);

  return {
    currentTotal,
    previousTotal,
    ...totalChange,
    currentRangeLabel: formatWeekLabel(currentStart),
    previousRangeLabel: formatWeekLabel(previousStart),
    byDeviceType,
    byBusiness,
  };
}

export type WeekBucket = {
  weekStart: Date;
  label: string;
  hoursByBusiness: Record<string, number>;
};

// All Sunday-Saturday weeks present in the data, each broken down per
// business — used to drive the multi-series weekly chart. Device counts
// aren't tracked per week here — utilization is measured against each
// business's fixed issued/defective device counts (see
// effectiveDevicesForBusiness in lib/utilization.ts), not whatever was
// logged that week.
export function groupWeeklyByBusiness(entries: WeeklyEntry[]): WeekBucket[] {
  const map = new Map<number, WeekBucket>();
  for (const e of entries) {
    const start = sundayStart(e.date);
    const key = start.getTime();
    let bucket = map.get(key);
    if (!bucket) {
      bucket = {
        weekStart: start,
        label: formatWeekLabel(start),
        hoursByBusiness: {},
      };
      map.set(key, bucket);
    }
    bucket.hoursByBusiness[e.businessId] = round1(
      (bucket.hoursByBusiness[e.businessId] ?? 0) + e.recordedHours,
    );
  }
  return Array.from(map.values()).sort(
    (a, b) => a.weekStart.getTime() - b.weekStart.getTime(),
  );
}
