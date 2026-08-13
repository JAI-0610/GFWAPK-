import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Icon-led empty state with an obvious next action for first-time users. */
export function EmptyState({
  icon: Icon,
  title,
  body,
  actionLabel,
  actionTo,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  actionLabel?: string;
  actionTo?: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
      <div className="relative mx-auto size-20">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/40 blur-xl" />
        <span className="relative grid h-full w-full place-items-center rounded-2xl bg-secondary/80 text-primary shadow-sm backdrop-blur-md border border-white/30 dark:border-white/10">
          <Icon className="size-8" aria-hidden="true" />
        </span>
      </div>
      <h3 className="mt-6 text-xl font-bold tracking-tight text-card-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {actionLabel && actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex min-h-12 items-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition-all"
          >
            {actionLabel}
          </Link>
        ) : null}
        {action}
      </div>
    </div>
  );
}
