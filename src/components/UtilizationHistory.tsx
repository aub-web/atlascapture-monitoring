import { formatDate } from "@/lib/date";
import { deviceTypeLabel } from "@/lib/constants";
import { utilizationHoursForEntry } from "@/lib/utilization";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

type Entry = {
  id: string;
  date: Date;
  deviceType: string;
  deviceCount: number;
};

export default function UtilizationHistory({
  businessId,
  entries,
  deleteAction,
}: {
  businessId: string;
  entries: Entry[];
  deleteAction: (formData: FormData) => Promise<void>;
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
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
        >
          <div>
            <p className="font-medium text-zinc-900">
              {formatDate(entry.date)}
            </p>
            <p className="text-sm text-zinc-500">
              {entry.deviceCount} × {deviceTypeLabel(entry.deviceType)} ={" "}
              {utilizationHoursForEntry(entry.deviceType, entry.deviceCount)}h
            </p>
          </div>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={entry.id} />
            <input type="hidden" name="businessId" value={businessId} />
            <ConfirmSubmitButton
              label="Delete"
              confirmMessage="Delete this utilization entry?"
              className="text-xs font-medium text-red-500 hover:text-red-700"
            />
          </form>
        </li>
      ))}
    </ul>
  );
}
