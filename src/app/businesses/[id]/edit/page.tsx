import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getBusinessWithCheckIns, getPartnerAssociates } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import EditBusinessForm from "@/components/EditBusinessForm";

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [business, associates] = await Promise.all([
    getBusinessWithCheckIns(id),
    getPartnerAssociates(),
  ]);

  if (!business) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-10">
      <Link
        href={`/businesses/${id}`}
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        Edit Business
      </h1>
      <EditBusinessForm
        id={business.id}
        defaultValues={{
          name: business.name,
          category: business.category,
          partnerAssociate: business.partnerAssociate,
        }}
        associates={associates.map((a) => a.name)}
      />
    </main>
  );
}
