import { Link } from "@tanstack/react-router";
import { Menu, Search, Sprout, X } from "lucide-react";
import { useState } from "react";

import { LanguagePicker } from "@/components/LanguagePicker";

const navLinks = [
  { label: "Find Work", to: "/browse" as const },
  { label: "How it works", to: "/how-it-works" as const },
  { label: "Pricing", to: "/pricing" as const },
  { label: "About", to: "/about" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-card/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img src="/logo.png" alt="GO FARM WORK" className="size-9 rounded-full object-cover shadow-sm" />
          <span className="truncate font-display text-[15px] font-extrabold tracking-tight text-foreground sm:text-base">
            GO FARM WORK
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-6 pl-4 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              activeProps={{ className: "text-foreground" }}
              className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <label className="ml-2 flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm text-muted-foreground focus-within:border-primary">
            <Search className="size-4 shrink-0" />
            <input
              placeholder="Search jobs, farms, farmers…"
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </label>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden md:block">
            <LanguagePicker compact />
          </div>
          <Link
            to="/auth"
            search={{ role: "landlord" }}
            className="hidden rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary md:inline-flex"
          >
            Post a Job
          </Link>
          <Link
            to="/auth"
            search={{ role: "worker", mode: "signin" }}
            className="hidden rounded-full px-3 py-2 text-sm font-semibold text-foreground hover:text-primary sm:inline-flex"
          >
            Signin
          </Link>
          <Link
            to="/auth"
            search={{ role: "worker" }}
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lift transition-transform active:scale-95"
          >
            Sign Up
          </Link>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-card px-4 py-4 lg:hidden">
          <div className="grid gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/auth"
              search={{ role: "landlord" }}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Post a Job
            </Link>
          </div>
          <div className="mt-3">
            <LanguagePicker />
          </div>
        </div>
      ) : null}
    </header>
  );
}
