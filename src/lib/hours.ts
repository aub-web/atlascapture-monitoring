export const LUNCH_BREAK_HOURS = 1;

function parseTimeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

// Expected recording hours between a start and stop time, minus the lunch
// break. E.g. 8:00 AM to 4:00 PM (16:00) minus 1 hour lunch = 7 hours.
export function computeExpectedHours(
  startTime: string,
  stopTime: string,
): number | null {
  const start = parseTimeToMinutes(startTime);
  const stop = parseTimeToMinutes(stopTime);
  if (start === null || stop === null || stop <= start) return null;

  const hours = (stop - start) / 60 - LUNCH_BREAK_HOURS;
  return Math.max(0, Math.round(hours * 100) / 100);
}

export function averageHours(values: number[]): number | null {
  if (values.length === 0) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round((total / values.length) * 100) / 100;
}
