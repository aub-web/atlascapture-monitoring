"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

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

function StatusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M2.5 11l3-4.5 3 6 3-9 3 7.5 2.5-4"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth={1.5} />
      <path
        d="M16.5 16.5l-4-4"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M12.5 3.5l-6 6.5 6 6.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M7.5 3.5l6 6.5-6 6.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M5 7.5l5 5 5-5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

const OVERALL_SUBSECTIONS: { id: string; label: string }[] = [
  { id: "outbound-summary", label: "Outbound check-in summary" },
  { id: "sales-summary", label: "Sales business summary" },
  { id: "daily-total-hours", label: "Daily total hours" },
  { id: "weekly-hours-by-team", label: "Weekly hours by team" },
  { id: "utilization-trend", label: "Daily / weekly / monthly utilization" },
];

const ITEMS: {
  href: string;
  label: string;
  icon: () => ReactNode;
  match: (pathname: string) => boolean;
  children?: { id: string; label: string }[];
}[] = [
  {
    href: "/",
    label: "Outbound Monitoring",
    icon: OutboundIcon,
    match: (p) =>
      (p === "/" ||
        (p.startsWith("/businesses") && !p.startsWith("/businesses/status")) ||
        p.startsWith("/associates")),
  },
  {
    href: "/sales",
    label: "Sales Monitoring",
    icon: SalesIcon,
    match: (p) =>
      p.startsWith("/sales") && !p.startsWith("/sales/businesses/status"),
  },
  {
    href: "/overall",
    label: "Overall Monitoring",
    icon: OverallIcon,
    match: (p) => p.startsWith("/overall"),
    children: OVERALL_SUBSECTIONS,
  },
  {
    href: "/businesses/status",
    label: "Outbound Status",
    icon: StatusIcon,
    match: (p) => p.startsWith("/businesses/status"),
  },
  {
    href: "/sales/businesses/status",
    label: "Sales Status",
    icon: StatusIcon,
    match: (p) => p.startsWith("/sales/businesses/status"),
  },
  {
    href: "/search",
    label: "Search",
    icon: SearchIcon,
    match: (p) => p.startsWith("/search"),
  },
  {
    href: "/admin/login",
    label: "Admin",
    icon: AdminIcon,
    match: (p) => p.startsWith("/admin"),
  },
];

const COLLAPSED_KEY = "sidebarCollapsed";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Set<string>>(
    () => new Set(["/overall"]),
  );

  function toggleMenu(href: string) {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "true");
    } catch {
      // Ignore — localStorage may be unavailable (private browsing, etc.).
    }
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next));
      } catch {
        // Ignore — localStorage may be unavailable (private browsing, etc.).
      }
      return next;
    });
  }

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col overflow-y-auto bg-slate-900 text-slate-100 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div
        className={`flex items-center pt-6 pb-5 ${
          collapsed ? "justify-center px-2" : "justify-between px-5"
        }`}
      >
        {!collapsed && (
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              Atlas Capture
            </p>
            <p className="mt-0.5 text-xs text-slate-400">SS Monitoring</p>
          </div>
        )}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? <ExpandIcon /> : <CollapseIcon />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const isOpen = openMenus.has(item.href);
          return (
            <div key={item.href}>
              <div
                className={
                  active
                    ? "flex items-center rounded-lg border-l-2 border-emerald-400 bg-slate-800 text-sm font-medium text-white"
                    : "flex items-center rounded-lg border-l-2 border-transparent text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }
              >
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex flex-1 items-center gap-3 py-2.5 ${collapsed ? "justify-center px-2" : "pl-3 pr-1"}`}
                >
                  <item.icon />
                  {!collapsed && item.label}
                </Link>
                {!collapsed && item.children && (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.href)}
                    aria-label={isOpen ? "Collapse section" : "Expand section"}
                    className="rounded-md p-2 text-slate-400 hover:text-white"
                  >
                    <ChevronDownIcon open={isOpen} />
                  </button>
                )}
              </div>

              {!collapsed && item.children && isOpen && (
                <div className="mt-0.5 flex flex-col gap-0.5 border-l border-slate-800 pl-4">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`${item.href}#${child.id}`}
                      className="truncate rounded-md py-1.5 pl-3 text-xs text-slate-400 hover:bg-slate-800/60 hover:text-white"
                      title={child.label}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
