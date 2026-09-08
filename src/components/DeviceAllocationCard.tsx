import InlineEditNumberField from "@/components/InlineEditNumberField";
import { effectiveDeviceCount } from "@/lib/utilization";

export default function DeviceAllocationCard({
  id,
  issuedMonoCount,
  issuedMulticamCount,
  defectiveMonoCount,
  defectiveMulticamCount,
  action,
}: {
  id: string;
  issuedMonoCount: number;
  issuedMulticamCount: number;
  defectiveMonoCount: number;
  defectiveMulticamCount: number;
  action: (formData: FormData) => Promise<void>;
}) {
  const effectiveMono = effectiveDeviceCount(issuedMonoCount, defectiveMonoCount);
  const effectiveMulticam = effectiveDeviceCount(
    issuedMulticamCount,
    defectiveMulticamCount,
  );

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        <div>
          <p className="text-xs text-zinc-500">Issued Mono</p>
          <InlineEditNumberField
            action={action}
            id={id}
            field="issuedMonoCount"
            value={issuedMonoCount}
          />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Issued Multicam</p>
          <InlineEditNumberField
            action={action}
            id={id}
            field="issuedMulticamCount"
            value={issuedMulticamCount}
          />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Defective Mono</p>
          <InlineEditNumberField
            action={action}
            id={id}
            field="defectiveMonoCount"
            value={defectiveMonoCount}
          />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Defective Multicam</p>
          <InlineEditNumberField
            action={action}
            id={id}
            field="defectiveMulticamCount"
            value={defectiveMulticamCount}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-400">
        Capacity is based on{" "}
        <span className="font-medium text-zinc-600">
          {effectiveMono} effective Mono
        </span>{" "}
        and{" "}
        <span className="font-medium text-zinc-600">
          {effectiveMulticam} effective Multicam
        </span>{" "}
        devices (issued minus defective).
      </p>
    </div>
  );
}
