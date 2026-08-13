"use client";

import { useActionState } from "react";
import { DEVICE_TYPES } from "@/lib/constants";
import { todayDateInputValue } from "@/lib/date";

type UtilizationActionState = { error: string } | null;

export default function UtilizationForm({
  businessId,
  action,
}: {
  businessId: string;
  action: (
    state: UtilizationActionState,
    formData: FormData,
  ) => Promise<UtilizationActionState>;
}) {
  const [state, formAction, isPending] = useActionState<
    UtilizationActionState,
    FormData
  >(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="businessId" value={businessId} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-zinc-700"
          >
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={todayDateInputValue()}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>

        <div>
          <label
            htmlFor="deviceType"
            className="block text-sm font-medium text-zinc-700"
          >
            Device type
          </label>
          <select
            id="deviceType"
            name="deviceType"
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          >
            <option value="">Select device type</option>
            {DEVICE_TYPES.map((device) => (
              <option key={device.value} value={device.value}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="deviceCount"
            className="block text-sm font-medium text-zinc-700"
          >
            Number of devices
          </label>
          <input
            id="deviceCount"
            name="deviceCount"
            type="number"
            min={1}
            step={1}
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>

        <div>
          <label
            htmlFor="recordedHours"
            className="block text-sm font-medium text-zinc-700"
          >
            Total recorded hours
          </label>
          <input
            id="recordedHours"
            name="recordedHours"
            type="number"
            min={0}
            step={0.5}
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Log Utilization"}
      </button>
    </form>
  );
}
