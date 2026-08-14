"use client";

import { useActionState } from "react";
import { DEVICE_TYPES } from "@/lib/constants";
import { todayDateInputValue, toDateInputValue } from "@/lib/date";
import { hoursToDurationParts } from "@/lib/duration";

type UtilizationActionState = { error: string } | null;

export default function UtilizationForm({
  businessId,
  action,
  entryId,
  defaultValues,
  submitLabel = "Log Utilization",
  pendingLabel = "Saving…",
}: {
  businessId: string;
  action: (
    state: UtilizationActionState,
    formData: FormData,
  ) => Promise<UtilizationActionState>;
  entryId?: string;
  defaultValues?: {
    date: Date;
    deviceType: string;
    deviceCount: number;
    recordedHours: number;
  };
  submitLabel?: string;
  pendingLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState<
    UtilizationActionState,
    FormData
  >(action, null);

  const duration = defaultValues
    ? hoursToDurationParts(defaultValues.recordedHours)
    : null;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="businessId" value={businessId} />
      {entryId && <input type="hidden" name="id" value={entryId} />}

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
            defaultValue={
              defaultValues
                ? toDateInputValue(defaultValues.date)
                : todayDateInputValue()
            }
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
            defaultValue={defaultValues?.deviceType ?? ""}
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
          defaultValue={defaultValues?.deviceCount}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-zinc-700">
          Total recorded (H:M:S)
        </span>
        <div className="mt-1 grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="recordedHoursH" className="sr-only">
              Hours
            </label>
            <input
              id="recordedHoursH"
              name="recordedHoursH"
              type="number"
              min={0}
              step={1}
              required
              placeholder="HH"
              defaultValue={duration?.hours}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            />
          </div>
          <div>
            <label htmlFor="recordedHoursM" className="sr-only">
              Minutes
            </label>
            <input
              id="recordedHoursM"
              name="recordedHoursM"
              type="number"
              min={0}
              max={59}
              step={1}
              required
              placeholder="MM"
              defaultValue={duration?.minutes}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            />
          </div>
          <div>
            <label htmlFor="recordedHoursS" className="sr-only">
              Seconds
            </label>
            <input
              id="recordedHoursS"
              name="recordedHoursS"
              type="number"
              min={0}
              max={59}
              step={1}
              required
              placeholder="SS"
              defaultValue={duration?.seconds}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            />
          </div>
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
        {isPending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
