"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  Sparkles,
  Calendar,
  Users,
  Settings,
  LogOut,
  Zap,
  FileText,
  Contact2,
  Target,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  soon: boolean;
};

const NAV_MAIN: NavItem[] = [
  { label: "Board", href: "/dashboard", icon: LayoutDashboard, soon: false },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2, soon: true },
  { label: "AI Insights", href: "/dashboard/ai-insights", icon: Sparkles, soon: true },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar, soon: true },
  { label: "Documents", href: "/dashboard/documents", icon: FileText, soon: true },
  { label: "Contacts", href: "/dashboard/contacts", icon: Contact2, soon: true },
  { label: "Goals", href: "/dashboard/goals", icon: Target, soon: true },
];

const NAV_FOOTER: NavItem[] = [
  { label: "Team", href: "/dashboard/team", icon: Users, soon: false },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, soon: false },
];

const MOBILE_NAV: NavItem[] = [NAV_MAIN[0], NAV_MAIN[1], NAV_MAIN[2], NAV_FOOTER[0], NAV_FOOTER[1]];

interface SidebarProps {
  readonly email: string;
}

export function Sidebar({ email }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  function cycleTheme() {
    const order: (typeof theme)[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  }

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        setLoggingOut(false);
        return;
      }
      router.refresh();
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
            <Zap size={15} className="text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-sidebar-foreground">
            Flow Pilot
          </span>
        </div>

        {/* Main nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV_MAIN.map((item) => (
            <DesktopNavItem key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* Footer nav + theme + user */}
        <div className="px-3 pb-4">
          <div className="space-y-0.5">
            {NAV_FOOTER.map((item) => (
              <DesktopNavItem key={item.href} item={item} active={isActive(item.href)} />
            ))}
          </div>

          <div className="mx-1 mt-3 border-t border-sidebar-border pt-3">
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              title={`Theme: ${theme}`}
              className="mb-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
            >
              <ThemeIcon size={15} className="shrink-0" />
              <span className="capitalize">{theme} mode</span>
            </button>

            {/* User card */}
            <div className="rounded-xl bg-sidebar-accent/60 px-3 py-2.5">
              <p className="truncate text-xs font-medium text-sidebar-foreground">{email}</p>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-2 flex items-center gap-1.5 text-xs text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground disabled:opacity-50"
              >
                <LogOut size={12} />
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center border-t border-border/60 bg-card/95 px-1 backdrop-blur-xl lg:hidden">
        {MOBILE_NAV.map((item) => (
          <MobileNavItem key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>
    </>
  );
}

function DesktopNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="block">
      <span
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
          active
            ? "bg-primary/10 text-primary"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
        )}
      >
        <Icon size={17} className="shrink-0" />
        <span className="flex-1 truncate">{item.label}</span>
        {item.soon && (
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Soon
          </span>
        )}
      </span>
    </Link>
  );
}

function MobileNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className="flex flex-1 flex-col items-center justify-center gap-1 py-1">
      <Icon
        size={20}
        className={cn("transition-colors", active ? "text-primary" : "text-muted-foreground")}
      />
      <span
        className={cn(
          "text-[10px] font-medium transition-colors",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}
