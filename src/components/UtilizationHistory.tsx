import Link from "next/link";
import { formatDate } from "@/lib/date";
import { deviceTypeLabel } from "@/lib/constants";
import { utilizationHoursForEntry, utilizationPercent } from "@/lib/utilization";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

function formatDeviceCount(count: number): string {
  return count === 1 ? "1 device" : `${count} devices`;
}

type Entry = {
  id: string;
  date: Date;
  deviceType: string;
  deviceCount: number;
  recordedHours: number;
};

export default function UtilizationHistory({
  businessId,
  entries,
  deleteAction,
  editBasePath,
  isAdmin = false,
}: {
  businessId: string;
  entries: Entry[];
  deleteAction: (formData: FormData) => Promise<void>;
  editBasePath: string;
  isAdmin?: boolean;
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
        No utilization entries logged yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => {
        const capacityHours = utilizationHoursForEntry(
          entry.deviceType,
          entry.deviceCount,
        );
        const percent = utilizationPercent(entry.recordedHours, capacityHours);
        return (
        <li
          key={entry.id}
          className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
        >
          <div>
            <p className="font-medium text-zinc-900">
              {formatDate(entry.date)}
            </p>
            <p className="text-sm text-zinc-500">
              {deviceTypeLabel(entry.deviceType)} ·{" "}
              {formatDeviceCount(entry.deviceCount)} ·{" "}
              {entry.recordedHours}h recorded
              {percent !== null && ` · ${percent}% utilized`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {isAdmin && (
              <Link
                href={`${editBasePath}/${businessId}/utilization/${entry.id}/edit`}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
              >
                Edit
              </Link>
            )}
            <form action={deleteAction}>
              <input type="hidden" name="id" value={entry.id} />
              <input type="hidden" name="businessId" value={businessId} />
              <ConfirmSubmitButton
                label="Delete"
                confirmMessage="Delete this utilization entry?"
                className="text-xs font-medium text-red-500 hover:text-red-700"
              />
            </form>
          </div>
        </li>
        );
      })}
    </ul>
  );
}
