import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCheckIn } from "@/lib/data";
import { updateCheckIn } from "@/lib/actions/checkin-actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import CheckInForm from "@/components/CheckInForm";

export default async function EditCheckInPage({
  params,
}: {
  params: Promise<{ id: string; checkInId: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id, checkInId } = await params;
  const checkIn = await getCheckIn(checkInId);

  if (!checkIn || checkIn.businessId !== id) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link
        href={`/businesses/${id}`}
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        Edit Check-in
      </h1>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
        <CheckInForm
          businessId={id}
          action={updateCheckIn}
          checkInId={checkIn.id}
          submitLabel="Save Changes"
          defaultValues={{
            checkInDate: checkIn.checkInDate,
            startTime: checkIn.startTime,
            stopTime: checkIn.stopTime,
            recordingsCount: checkIn.recordingsCount,
            deviceType: checkIn.deviceType,
            whatWentWrong: checkIn.whatWentWrong,
            whatNeedsImprovement: checkIn.whatNeedsImprovement,
          }}
        />
      </div>
    </main>
  );
}
