import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Briefcase, Grid3x3, Home, MessageCircle, Sparkles, User } from "lucide-react";
import type { ReactNode } from "react";

import { LanguagePicker } from "@/components/LanguagePicker";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", icon: Home, key: "appName" },
  { to: "/jobs", icon: Briefcase, key: "findWork" },
  { to: "/assistant", icon: Sparkles, key: "assistant" },
  { to: "/messages", icon: MessageCircle, key: "messages" },
  { to: "/more", icon: Grid3x3, key: "more" },
] as const;


export function AppShell({
  title,
  subtitle,
  action,
  headerImage,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  headerImage?: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Ambient background glows for hyper-premium feel */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-money/5 blur-[100px] pointer-events-none z-0" />
      
      <div className="relative z-10">
        <header 
        className={cn(
          "relative px-4 pb-6 pt-5 text-white overflow-hidden",
          !headerImage && "bg-primary text-primary-foreground"
        )}
      >
        {headerImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${headerImage})` }} 
            />
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 to-transparent" />
          </>
        )}
        <div className="relative mx-auto flex max-w-3xl items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight drop-shadow-sm">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm font-medium opacity-90">{subtitle}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {action}
            <LanguagePicker compact />
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20 border border-white/10"
            >
              <Bell className="size-4.5" />
            </Link>
            <Link
              to="/profile"
              aria-label="Profile"
              className="grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20 border border-white/10"
            >
              <User className="size-4.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.02)]">
        <div className="mx-auto flex max-w-3xl">
          {NAV.map(({ to, icon: Icon, key }) => {
            const active = pathname === to;
            return (
               <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("size-5", active && "stroke-[2.5]")} />
                <span className="max-w-full truncate px-1">
                  {key === "appName" ? "Home" : key === "more" ? "More" : t(key)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      </div>
    </div>
  );
}
