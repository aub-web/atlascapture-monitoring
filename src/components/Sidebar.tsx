"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function OutboundIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M2.5 2.5l15 7.5-15 7.5 3.5-7.5-3.5-7.5z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SalesIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M3 16.5V9M9 16.5V4M15 16.5v-6.5M2.5 16.5h15"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OverallIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <rect x="2.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth={1.5} />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth={1.5} />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth={1.5} />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M10 2.5l6 2.5v4.5c0 4-2.6 6.9-6 8-3.4-1.1-6-4-6-8V5l6-2.5z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10l1.8 1.8L12.5 8"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ITEMS: {
  href: string;
  label: string;
  icon: () => ReactNode;
  match: (pathname: string) => boolean;
}[] = [
  {
    href: "/",
    label: "Outbound Monitoring",
    icon: OutboundIcon,
    match: (p) =>
      p === "/" || p.startsWith("/businesses") || p.startsWith("/associates"),
  },
  {
    href: "/sales",
    label: "Sales Monitoring",
    icon: SalesIcon,
    match: (p) => p.startsWith("/sales"),
  },
  {
    href: "/overall",
    label: "Overall Monitoring",
    icon: OverallIcon,
    match: (p) => p.startsWith("/overall"),
  },
  {
    href: "/admin/login",
    label: "Admin",
    icon: AdminIcon,
    match: (p) => p.startsWith("/admin"),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-slate-900 text-slate-100">
      <div className="px-5 pt-6 pb-5">
        <p className="text-lg font-semibold tracking-tight text-white">
          Atlas Capture
        </p>
        <p className="mt-0.5 text-xs text-slate-400">SS Monitoring</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex items-center gap-3 rounded-lg border-l-2 border-emerald-400 bg-slate-800 py-2.5 pl-3 pr-3 text-sm font-medium text-white"
                  : "flex items-center gap-3 rounded-lg border-l-2 border-transparent py-2.5 pl-3 pr-3 text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }
            >
              <item.icon />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
