import { businessStatusLabel } from "@/lib/constants";

export default function BusinessStatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={
        isActive
          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
          : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500"
      }
    >
      {businessStatusLabel(status)}
    </span>
  );
}
