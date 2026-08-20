import { prisma } from "@/lib/prisma";
import BusinessStatusSection from "@/components/BusinessStatusSection";

// Always show live data — never freeze this page as a static build-time
// snapshot.
export const dynamic = "force-dynamic";

export default async function SalesBusinessStatusPage() {
  const businesses = await prisma.salesBusiness.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, salesAgent: true, status: true },
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Sales Business Status
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Active and inactive Sales Monitoring businesses
      </p>

      <div className="mt-6">
        <BusinessStatusSection
          businesses={businesses.map((b) => ({
            id: b.id,
            name: b.name,
            status: b.status,
            subtitle: b.salesAgent,
          }))}
          detailBasePath="/sales/businesses"
        />
      </div>
    </main>
  );
}
