import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  CalendarDays,
  Heart,
  Home,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

const tabs: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/calendrier", label: "Calendrier", icon: CalendarDays },
  { to: "/coach", label: "Coach IA", icon: MessageCircle },
  { to: "/recuperation", label: "Récup", icon: Heart },
  { to: "/analytique", label: "Stats", icon: Activity },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="dark mx-auto flex min-h-screen max-w-md flex-col bg-transparent text-foreground">
      <main className="flex-1 px-4 pb-28 pt-6">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-background/85 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
        <ul className="grid grid-cols-5 gap-1">
          {tabs.map((t) => {
            const active =
              t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className={
                    "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition " +
                    (active
                      ? "bg-graphite-2 text-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <Icon
                    className={
                      "h-5 w-5 " + (active ? "text-primary" : "")
                    }
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className="uppercase tracking-wider">{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="truncate text-2xl font-black">{title}</h1>
      </div>
      {action}
    </header>
  );
}
