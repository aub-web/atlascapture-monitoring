"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createSalesBusiness,
  type CreateSalesBusinessState,
} from "@/lib/actions/sales-business-actions";

export default function NewSalesBusinessForm({
  agents,
}: {
  agents: string[];
}) {
  const [state, formAction, isPending] = useActionState<
    CreateSalesBusinessState,
    FormData
  >(createSalesBusiness, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700"
        >
          Business name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="salesAgent"
            className="block text-sm font-medium text-zinc-700"
          >
            Sales agent
          </label>
          <Link
            href="/sales/agents"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
          >
            + Add new
          </Link>
        </div>
        <select
          id="salesAgent"
          name="salesAgent"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        >
          <option value="">Select sales agent</option>
          {agents.map((agent) => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {isPending ? "Creating…" : "Create Business"}
        </button>
        <Link
          href="/sales"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
