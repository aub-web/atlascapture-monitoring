// Recorded-hours are entered as H:M:S and stored as decimal hours.
export function parseDurationParts(
  hours: number,
  minutes: number,
  seconds: number,
): number {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return Math.round((totalSeconds / 3600) * 100) / 100;
}

// Reads <prefix>H/M/S from a submitted form (default prefix "recordedHours")
// and returns the decimal hours, or null if any part is missing/invalid.
export function parseDurationFormData(
  formData: FormData,
  prefix: string = "recordedHours",
): number | null {
  const h = Number(formData.get(`${prefix}H`));
  const m = Number(formData.get(`${prefix}M`));
  const s = Number(formData.get(`${prefix}S`));
  if (
    !Number.isFinite(h) || h < 0 ||
    !Number.isFinite(m) || m < 0 || m > 59 ||
    !Number.isFinite(s) || s < 0 || s > 59
  ) {
    return null;
  }
  return parseDurationParts(h, m, s);
}

export function hoursToDurationParts(decimalHours: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const totalSeconds = Math.round(decimalHours * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}
