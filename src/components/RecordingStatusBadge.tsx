import { recordingStatusLabel } from "@/lib/constants";

const STYLES: Record<string, string> = {
  ACTIVELY_RECORDING: "bg-emerald-50 text-emerald-700",
  PAUSED: "bg-amber-50 text-amber-700",
  DONE_RECORDING: "bg-blue-50 text-blue-700",
  CANCELLED_BY_OWNER: "bg-red-50 text-red-700",
  PULLOUT: "bg-red-50 text-red-700",
};

export default function RecordingStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        STYLES[status] ?? "bg-zinc-100 text-zinc-500"
      }`}
    >
      {recordingStatusLabel(status)}
    </span>
  );
}
