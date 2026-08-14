"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  updateBusiness,
  type UpdateBusinessState,
} from "@/lib/actions/business-actions";
import { BUSINESS_CATEGORIES, PARTNER_ASSOCIATES } from "@/lib/constants";

export default function EditBusinessForm({
  id,
  defaultValues,
}: {
  id: string;
  defaultValues: { name: string; category: string; partnerAssociate: string };
}) {
  const [state, formAction, isPending] = useActionState<
    UpdateBusinessState,
    FormData
  >(updateBusiness, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="id" value={id} />

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
          defaultValue={defaultValues.name}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-zinc-700"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={defaultValues.category}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        >
          <option value="">Select category</option>
          {BUSINESS_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="partnerAssociate"
          className="block text-sm font-medium text-zinc-700"
        >
          Partner associate
        </label>
        <select
          id="partnerAssociate"
          name="partnerAssociate"
          required
          defaultValue={defaultValues.partnerAssociate}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        >
          <option value="">Select partner associate</option>
          {PARTNER_ASSOCIATES.map((associate) => (
            <option key={associate} value={associate}>
              {associate}
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
          {isPending ? "Saving…" : "Save Changes"}
        </button>
        <Link
          href={`/businesses/${id}`}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
