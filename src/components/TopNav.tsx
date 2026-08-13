"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Outbound Monitoring" },
  { href: "/sales", label: "Sales Monitoring" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6">
        <div className="flex gap-6">
          {TABS.map((tab) => {
            const active =
              tab.href === "/"
                ? pathname === "/" ||
                  pathname.startsWith("/businesses") ||
                  pathname.startsWith("/summary")
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={
                  active
                    ? "border-b-2 border-zinc-900 py-3 text-sm font-medium text-zinc-900"
                    : "border-b-2 border-transparent py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900"
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
        <Link
          href="/admin/login"
          className={
            pathname.startsWith("/admin")
              ? "border-b-2 border-zinc-900 py-3 text-sm font-medium text-zinc-900"
              : "border-b-2 border-transparent py-3 text-sm font-medium text-zinc-400 hover:text-zinc-900"
          }
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
