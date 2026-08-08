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
    <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-card-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {actionLabel && actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-bold text-primary-foreground shadow-card active:scale-95"
          >
            {actionLabel}
          </Link>
        ) : null}
        {action}
      </div>
    </div>
  );
}
