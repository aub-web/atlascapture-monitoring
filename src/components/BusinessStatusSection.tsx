import Link from "next/link";
import BusinessStatusBadge from "@/components/BusinessStatusBadge";

type Business = {
  id: string;
  name: string;
  status: string;
  subtitle: string;
};

export default function BusinessStatusSection({
  businesses,
  detailBasePath,
}: {
  businesses: Business[];
  detailBasePath: string;
}) {
  const active = businesses.filter((b) => b.status === "ACTIVE");
  const inactive = businesses.filter((b) => b.status !== "ACTIVE");

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[
        { label: "Active", items: active },
        { label: "Inactive", items: inactive },
      ].map((group) => (
        <div key={group.label}>
          <h3 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            {group.label}{" "}
            <span className="font-normal normal-case text-zinc-400">
              ({group.items.length})
            </span>
          </h3>
          <div className="mt-2 space-y-2">
            {group.items.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-4 text-center text-sm text-zinc-400">
                None
              </p>
            ) : (
              group.items.map((business) => (
                <Link
                  key={business.id}
                  href={`${detailBasePath}/${business.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2.5 hover:border-zinc-300 hover:shadow-sm"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {business.name}
                    </p>
                    <p className="text-xs text-zinc-500">{business.subtitle}</p>
                  </div>
                  <BusinessStatusBadge status={business.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
