import { prisma } from "@/lib/prisma";
import { categoryLabel } from "@/lib/constants";
import BusinessStatusSection from "@/components/BusinessStatusSection";

// Always show live data — never freeze this page as a static build-time
// snapshot.
export const dynamic = "force-dynamic";

export default async function OutboundBusinessStatusPage() {
  const businesses = await prisma.business.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      partnerAssociate: true,
      status: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Outbound Business Status
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Active and inactive Outbound Monitoring businesses
      </p>

      <div className="mt-6">
        <BusinessStatusSection
          businesses={businesses.map((b) => ({
            id: b.id,
            name: b.name,
            status: b.status,
            subtitle: `${categoryLabel(b.category)} · ${b.partnerAssociate}`,
          }))}
          detailBasePath="/businesses"
        />
      </div>
    </main>
  );
}
