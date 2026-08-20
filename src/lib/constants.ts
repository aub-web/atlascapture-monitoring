export const BUSINESS_CATEGORIES = [
  { value: "DIRECT_BUSINESS", label: "Direct Business" },
  { value: "ENTERPRISE", label: "Enterprise" },
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number]["value"];

export function categoryLabel(value: string): string {
  return (
    BUSINESS_CATEGORIES.find((c) => c.value === value)?.label ?? value
  );
}

// Informational only — check-ins are logged manually, nothing enforces this.
export const MONITORING_CADENCE_DAYS = 3;

export const DEVICE_TYPES = [
  { value: "MONO", label: "Mono" },
  { value: "MULTICAM", label: "Multicam" },
] as const;

export type DeviceType = (typeof DEVICE_TYPES)[number]["value"];

export function deviceTypeLabel(value: string): string {
  return DEVICE_TYPES.find((d) => d.value === value)?.label ?? value;
}

