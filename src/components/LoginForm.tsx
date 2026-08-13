"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { loginAdmin } from "@/lib/actions/admin-auth-actions";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await loginAdmin(password);
      if ("error" in result) {
        setError(result.error);
        setPassword("");
        return;
      }
      router.replace("/admin/history");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="password" className="sr-only">
          Admin password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="off"
          autoFocus
          required
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3.5 text-center text-lg text-zinc-900 placeholder:text-sm placeholder:tracking-normal placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-zinc-900 px-4 py-3.5 text-base font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Checking…" : "Unlock"}
      </button>
    </form>
  );
}
