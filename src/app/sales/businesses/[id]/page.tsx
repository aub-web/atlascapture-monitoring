import Link from "next/link";
import { notFound } from "next/navigation";
import { getSalesBusinessWithUtilization } from "@/lib/sales-data";
import {
  deleteSalesBusiness,
  updateSalesBusinessStatus,
} from "@/lib/actions/sales-business-actions";
import {
  createSalesUtilizationEntry,
  deleteSalesUtilizationEntry,
} from "@/lib/actions/sales-utilization-actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import UtilizationForm from "@/components/UtilizationForm";
import UtilizationHistory from "@/components/UtilizationHistory";
import UtilizationSummary from "@/components/UtilizationSummary";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import BusinessStatusBadge from "@/components/BusinessStatusBadge";
import StatusToggleForm from "@/components/StatusToggleForm";

export default async function SalesBusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [business, isAdmin] = await Promise.all([
    getSalesBusinessWithUtilization(id),
    isAdminAuthenticated(),
  ]);

  if (!business) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/sales" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back
      </Link>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-zinc-900">
              {business.name}
            </h1>
            <BusinessStatusBadge status={business.status} />
          </div>
          <p className="mt-1 text-sm text-zinc-500">{business.salesAgent}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <StatusToggleForm
            id={business.id}
            status={business.status}
            action={updateSalesBusinessStatus}
          />
          {isAdmin && (
            <Link
              href={`/sales/businesses/${business.id}/edit`}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
            >
              Edit
            </Link>
          )}
          <form action={deleteSalesBusiness}>
            <input type="hidden" name="id" value={business.id} />
            <ConfirmSubmitButton
              label="Delete business"
              confirmMessage={`Delete ${business.name} and all of its utilization entries?`}
              className="text-xs font-medium text-red-500 hover:text-red-700"
            />
          </form>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Log device utilization
        </h2>
        <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-4">
          <UtilizationForm
            businessId={business.id}
            action={createSalesUtilizationEntry}
            showRemarks
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Utilization summary
        </h2>
        <div className="mt-3">
          <UtilizationSummary entries={business.utilizationEntries} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Utilization history
        </h2>
        <div className="mt-3">
          <UtilizationHistory
            businessId={business.id}
            entries={business.utilizationEntries}
            deleteAction={deleteSalesUtilizationEntry}
            editBasePath="/sales/businesses"
            isAdmin={isAdmin}
          />
        </div>
      </section>
    </main>
  );
}
