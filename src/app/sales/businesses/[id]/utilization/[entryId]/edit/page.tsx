import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSalesUtilizationEntry } from "@/lib/sales-data";
import { updateSalesUtilizationEntry } from "@/lib/actions/sales-utilization-actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import UtilizationForm from "@/components/UtilizationForm";

export default async function EditSalesUtilizationEntryPage({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id, entryId } = await params;
  const entry = await getSalesUtilizationEntry(entryId);

  if (!entry || entry.businessId !== id) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-10">
      <Link
        href={`/sales/businesses/${id}`}
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        Edit Utilization Entry
      </h1>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
        <UtilizationForm
          businessId={id}
          action={updateSalesUtilizationEntry}
          entryId={entry.id}
          submitLabel="Save Changes"
          defaultValues={{
            date: entry.date,
            deviceType: entry.deviceType,
            deviceCount: entry.deviceCount,
            recordedHours: entry.recordedHours,
          }}
        />
      </div>
    </main>
  );
}
