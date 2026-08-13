"use client";

import { useActionState, useState } from "react";
import {
  createCheckIn,
  type CreateCheckInState,
} from "@/lib/actions/checkin-actions";
import { todayDateInputValue } from "@/lib/date";
import { DEVICE_TYPES } from "@/lib/constants";
import { computeExpectedHours } from "@/lib/hours";

export default function CheckInForm({ businessId }: { businessId: string }) {
  const [state, formAction, isPending] = useActionState<
    CreateCheckInState,
    FormData
  >(createCheckIn, null);
  const [startTime, setStartTime] = useState("");
  const [stopTime, setStopTime] = useState("");
  const expectedHours = computeExpectedHours(startTime, stopTime);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="businessId" value={businessId} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="checkInDate"
            className="block text-sm font-medium text-zinc-700"
          >
            Check-in date
          </label>
          <input
            id="checkInDate"
            name="checkInDate"
            type="date"
            required
            defaultValue={todayDateInputValue()}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>

        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-zinc-700"
          >
            Should start recording at
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="stopTime"
            className="block text-sm font-medium text-zinc-700"
          >
            Should stop recording at
          </label>
          <input
            id="stopTime"
            name="stopTime"
            type="time"
            required
            value={stopTime}
            onChange={(e) => setStopTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>

        <div>
          <label
            htmlFor="recordingsCount"
            className="block text-sm font-medium text-zinc-700"
          >
            How many recorded
          </label>
          <input
            id="recordingsCount"
            name="recordingsCount"
            type="number"
            min={0}
            step={1}
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        Expected recording hours (minus 1hr lunch):{" "}
        <span className="font-medium text-zinc-700">
          {expectedHours === null ? "—" : `${expectedHours}h`}
        </span>
      </p>

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

      <div>
        <label
          htmlFor="whatWentWrong"
          className="block text-sm font-medium text-zinc-700"
        >
          What went wrong
        </label>
        <textarea
          id="whatWentWrong"
          name="whatWentWrong"
          rows={2}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        />
      </div>

      <div>
        <label
          htmlFor="whatNeedsImprovement"
          className="block text-sm font-medium text-zinc-700"
        >
          What needs to improve
        </label>
        <textarea
          id="whatNeedsImprovement"
          name="whatNeedsImprovement"
          rows={2}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        />
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
        {isPending ? "Saving…" : "Log Check-in"}
      </button>
    </form>
  );
}
