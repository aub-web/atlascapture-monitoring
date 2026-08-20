import { prisma } from "@/lib/prisma";
import { categoryLabel } from "@/lib/constants";
import BusinessSearch from "@/components/BusinessSearch";

// Always show live data — never freeze this page as a static build-time
// snapshot.
export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const [outbound, sales] = await Promise.all([
    prisma.business.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        category: true,
        partnerAssociate: true,
        status: true,
      },
    }),
    prisma.salesBusiness.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, salesAgent: true, status: true },
    }),
  ]);

  const businesses = [
    ...outbound.map((b) => ({
      id: b.id,
      name: b.name,
      subtitle: `${categoryLabel(b.category)} · ${b.partnerAssociate}`,
      status: b.status,
      section: "Outbound Monitoring",
      href: `/businesses/${b.id}`,
    })),
    ...sales.map((b) => ({
      id: b.id,
      name: b.name,
      subtitle: b.salesAgent,
      status: b.status,
      section: "Sales Monitoring",
      href: `/sales/businesses/${b.id}`,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Search Businesses
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Search across Outbound and Sales Monitoring
      </p>

      <div className="mt-6">
        <BusinessSearch businesses={businesses} />
      </div>
    </main>
  );
}
