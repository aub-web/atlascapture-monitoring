"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BusinessStatusBadge from "@/components/BusinessStatusBadge";

type Business = {
  id: string;
  name: string;
  subtitle: string;
  status: string;
  section: string;
  href: string;
};

export default function BusinessSearch({
  businesses,
}: {
  businesses: Business[];
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return businesses;
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.section.toLowerCase().includes(q),
    );
  }, [businesses, query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by business name, category, partner associate, or sales agent…"
        autoFocus
        className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900"
      />
      <p className="mt-2 text-xs text-zinc-400">
        {results.length} of {businesses.length} businesses
      </p>
      <div className="mt-4 space-y-2">
        {results.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
            No businesses match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          results.map((b) => (
            <Link
              key={`${b.section}-${b.id}`}
              href={b.href}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2.5 hover:border-zinc-300 hover:shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">{b.name}</p>
                <p className="text-xs text-zinc-500">
                  {b.section} · {b.subtitle}
                </p>
              </div>
              <BusinessStatusBadge status={b.status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
