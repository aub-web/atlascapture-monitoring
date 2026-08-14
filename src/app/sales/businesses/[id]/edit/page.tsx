import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSalesBusinessWithUtilization } from "@/lib/sales-data";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import EditSalesBusinessForm from "@/components/EditSalesBusinessForm";

export default async function EditSalesBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const business = await getSalesBusinessWithUtilization(id);

  if (!business) {
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
        Edit Business
      </h1>
      <EditSalesBusinessForm
        id={business.id}
        defaultValues={{ name: business.name, salesAgent: business.salesAgent }}
      />
    </main>
  );
}
