"use client";

import { useActionState, useRef, useEffect } from "react";
import {
  createPartnerAssociate,
  type CreatePartnerAssociateState,
} from "@/lib/actions/partner-associate-actions";

export default function AddPartnerAssociateForm() {
  const [state, formAction, isPending] = useActionState<
    CreatePartnerAssociateState,
    FormData
  >(createPartnerAssociate, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === null) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex items-start gap-3">
      <div className="flex-1">
        <label htmlFor="name" className="sr-only">
          Partner associate name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Full name"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        />
        {state?.error && (
          <p className="mt-2 text-sm text-red-700">{state.error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Adding…" : "Add"}
      </button>
    </form>
  );
}
