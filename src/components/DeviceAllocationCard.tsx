import InlineEditNumberField from "@/components/InlineEditNumberField";
import { DEVICE_TYPES } from "@/lib/constants";
import { effectiveDeviceCount, type BusinessDeviceCounts } from "@/lib/utilization";

// Maps a device type value to its issued/defective field-name suffix, e.g.
// "MONO_INSTA360" -> "MonoInsta360Count".
function fieldSuffix(deviceType: string): string {
  return (
    deviceType
      .toLowerCase()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") + "Count"
  );
}

export default function DeviceAllocationCard({
  id,
  counts,
  action,
}: {
  id: string;
  counts: BusinessDeviceCounts;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {DEVICE_TYPES.map((deviceType) => {
          const suffix = fieldSuffix(deviceType.value);
          const issuedField = `issued${suffix}` as keyof BusinessDeviceCounts;
          const defectiveField = `defective${suffix}` as keyof BusinessDeviceCounts;
          const issued = counts[issuedField];
          const defective = counts[defectiveField];
          const effective = effectiveDeviceCount(issued, defective);
          return (
            <div key={deviceType.value}>
              <p className="text-xs font-medium text-zinc-700">
                {deviceType.label}
              </p>
              <div className="mt-1.5 flex items-center gap-3">
                <div>
                  <p className="text-[11px] text-zinc-400">Issued</p>
                  <InlineEditNumberField
                    action={action}
                    id={id}
                    field={issuedField}
                    value={issued}
                  />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400">Defective</p>
                  <InlineEditNumberField
                    action={action}
                    id={id}
                    field={defectiveField}
                    value={defective}
                  />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400">Effective</p>
                  <p className="px-1.5 py-1 text-sm font-medium text-zinc-900">
                    {effective}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-zinc-400">
        Utilization capacity is based on effective devices (issued minus
        defective) for each device type.
      </p>
    </div>
  );
}
