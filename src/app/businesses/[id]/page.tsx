import Link from "next/link";
import { notFound } from "next/navigation";
import { getBusinessWithCheckIns } from "@/lib/data";
import { deleteBusiness } from "@/lib/actions/business-actions";
import { categoryLabel, MONITORING_CADENCE_DAYS } from "@/lib/constants";
import { averageHours } from "@/lib/hours";
import {
  createUtilizationEntry,
  deleteUtilizationEntry,
} from "@/lib/actions/utilization-actions";
import CheckInForm from "@/components/CheckInForm";
import CheckInHistory from "@/components/CheckInHistory";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import UtilizationForm from "@/components/UtilizationForm";
import UtilizationHistory from "@/components/UtilizationHistory";
import UtilizationSummary from "@/components/UtilizationSummary";

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = await getBusinessWithCheckIns(id);

  if (!business) {
    notFound();
  }

  const avgExpectedHours = averageHours(
    business.checkIns.map((c) => c.expectedHours),
  );
  const avgRecorded = averageHours(
    business.checkIns.map((c) => c.recordingsCount),
  );

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back
      </Link>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            {business.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {categoryLabel(business.category)} · {business.partnerAssociate}
          </p>
        </div>
        <form action={deleteBusiness}>
          <input type="hidden" name="id" value={business.id} />
          <ConfirmSubmitButton
            label="Delete business"
            confirmMessage={`Delete ${business.name} and all of its check-ins?`}
            className="shrink-0 text-xs font-medium text-red-500 hover:text-red-700"
          />
        </form>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Log a check-in
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Monitoring cadence: every {MONITORING_CADENCE_DAYS} days
        </p>
        <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-4">
          <CheckInForm businessId={business.id} />
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            Check-in history
          </h2>
          {avgExpectedHours !== null && (
            <p className="text-xs text-zinc-400">
              Avg {avgRecorded}h recorded / {avgExpectedHours}h expected
            </p>
          )}
        </div>
        <div className="mt-3">
          <CheckInHistory businessId={business.id} checkIns={business.checkIns} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Log device utilization
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Multicam = 6h per device · Mono = 4h per device
        </p>
        <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-4">
          <UtilizationForm
            businessId={business.id}
            action={createUtilizationEntry}
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
            deleteAction={deleteUtilizationEntry}
          />
        </div>
      </section>
    </main>
  );
}
