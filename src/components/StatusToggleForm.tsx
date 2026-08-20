export default function StatusToggleForm({
  id,
  status,
  action,
}: {
  id: string;
  status: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const nextStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  const label = status === "ACTIVE" ? "Mark inactive" : "Mark active";

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={nextStatus} />
      <button
        type="submit"
        className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
      >
        {label}
      </button>
    </form>
  );
}
