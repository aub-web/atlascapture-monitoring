import Link from "next/link";
import NewSalesBusinessForm from "@/components/NewSalesBusinessForm";

export default function NewSalesBusinessPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-10">
      <Link href="/sales" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        New Business
      </h1>
      <NewSalesBusinessForm />
    </main>
  );
}
