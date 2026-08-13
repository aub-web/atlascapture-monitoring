import Link from "next/link";
import NewBusinessForm from "@/components/NewBusinessForm";

export default function NewBusinessPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        New Business
      </h1>
      <NewBusinessForm />
    </main>
  );
}
