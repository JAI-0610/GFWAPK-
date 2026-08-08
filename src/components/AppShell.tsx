import { Link, useRouterState } from "@tanstack/react-router";
import { Briefcase, Home, MessageCircle, Sparkles, Wallet } from "lucide-react";
import type { ReactNode } from "react";

import { LanguagePicker } from "@/components/LanguagePicker";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", icon: Home, key: "appName" },
  { to: "/jobs", icon: Briefcase, key: "findWork" },
  { to: "/assistant", icon: Sparkles, key: "assistant" },
  { to: "/messages", icon: MessageCircle, key: "messages" },
  { to: "/wallet", icon: Wallet, key: "wallet" },
] as const;

export function AppShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-field px-4 pb-6 pt-5 text-primary-deep-foreground">
        <div className="mx-auto flex max-w-3xl items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm opacity-85">{subtitle}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {action}
            <LanguagePicker compact />
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-3 max-w-3xl px-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card">
        <div className="mx-auto flex max-w-3xl">
          {NAV.map(({ to, icon: Icon, key }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("size-6", active && "stroke-[2.5]")} />
                <span className="max-w-full truncate px-1">
                  {key === "appName" ? "Home" : t(key)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
