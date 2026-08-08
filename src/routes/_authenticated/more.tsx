import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BellRing,
  Bookmark,
  MessageCircle,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/more")({
  component: MorePage,
  head: () => ({
    meta: [
      { title: "More Tools | GO FARM WORK" },
      {
        name: "description",
        content: "Wallet, saved jobs, alerts, worker search, wage rates and reviews in one place.",
      },
      { property: "og:title", content: "More Tools | GO FARM WORK" },
      {
        property: "og:description",
        content: "Wallet, saved jobs, alerts, worker search, wage rates and reviews in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const items = [
  { to: "/wallet", label: "Wallet & escrow", icon: Wallet },
  { to: "/saved", label: "Saved jobs", icon: Bookmark },
  { to: "/alerts", label: "Job alerts", icon: BellRing },
  { to: "/workers", label: "Find workers", icon: Users },
  { to: "/rates", label: "Wage rates & notices", icon: TrendingUp },
  { to: "/reviews", label: "Ratings & reviews", icon: Star },
  { to: "/assistant", label: "Farmhand AI", icon: Sparkles },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "My profile", icon: User },
] as const;

function MorePage() {
  return (
    <AppShell title="More" subtitle="Everything else you need on the farm">
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-card active:scale-[0.98]"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary">
              <Icon className="size-5" />
            </span>
            <span className="font-bold leading-tight text-card-foreground">{label}</span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
