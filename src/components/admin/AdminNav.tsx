"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  LogOut,
  ExternalLink,
  Inbox,
  Send,
  BarChart3,
  Search,
  Wallet,
} from "lucide-react";
import { canView, roleLabels, type DashboardArea } from "@/lib/access";
import type { TeamRole } from "@/lib/cms-types";
import BrandLogo from "@/components/BrandLogo";

const links: { href: string; label: string; icon: typeof LayoutDashboard; area: DashboardArea }[] = [
  { href: "/admin", label: "Today", icon: LayoutDashboard, area: "overview" },
  { href: "/admin/leads", label: "Leads", icon: Inbox, area: "leads" },
  { href: "/admin/outreach", label: "Cold outreach", icon: Send, area: "outreach" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, area: "projects" },
  { href: "/admin/business", label: "Business", icon: Wallet, area: "business" },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, area: "reports" },
  { href: "/admin/team", label: "People", icon: Users, area: "team" },
  { href: "/admin/search", label: "Search listing", icon: Search, area: "search" },
];

const groups: { label: string; areas: DashboardArea[] }[] = [
  { label: "Today", areas: ["overview"] },
  { label: "Business development", areas: ["leads", "outreach"] },
  { label: "Delivery", areas: ["projects"] },
  { label: "Company", areas: ["business", "reports", "team"] },
  { label: "Website", areas: ["search"] },
];

export default function AdminNav({ email, role }: { email: string; role: TeamRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const visible = links.filter((link) => canView(role, link.area));
  const sections = groups
    .map((group) => ({
      label: group.label,
      links: visible.filter((link) => group.areas.includes(link.area)),
    }))
    .filter((group) => group.links.length > 0);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex max-h-[42vh] w-full shrink-0 flex-col overflow-hidden border-b border-emerald-950 bg-[#07140f] text-slate-100 lg:h-dvh lg:max-h-none lg:w-64 lg:border-b-0 lg:border-r">
      <div className="px-5 pb-4 pt-6">
        <div className="flex items-center gap-3">
          <BrandLogo size={36} className="bg-white" />
          <div className="min-w-0">
            <p className="font-display text-base font-bold leading-none">Liminova Labs</p>
            <p className="mt-1 text-[11px] text-emerald-200/80">Software and digital</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.links.map((link) => {
                const Icon = link.icon;
                const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active ? "bg-emerald-400/15 text-emerald-200" : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 px-3 py-4">
        <div className="px-3 pb-3">
          <p className="truncate text-sm font-medium text-white">{email}</p>
          <p className="mt-0.5 text-xs font-semibold text-emerald-300">{roleLabels[role]}</p>
        </div>
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
          <ExternalLink className="h-4 w-4" />
          View site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
