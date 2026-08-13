import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

const columns: { title: string; items: { label: string; to: string }[] }[] = [
  {
    title: "For Farms",
    items: [
      { label: "How to Hire", to: "/how-it-works" },
      { label: "Post a Job", to: "/auth" },
      { label: "Talent Marketplace", to: "/browse" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "For Farmers",
    items: [
      { label: "How to Find Work", to: "/how-it-works" },
      { label: "Create Profile", to: "/auth" },
      { label: "Find Jobs", to: "/browse" },
      { label: "Get Paid Safely", to: "/how-it-works" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Us", to: "/about" },
      { label: "Contact Us", to: "/contact" },
      { label: "Trust & Safety", to: "/about" },
      { label: "Pricing & FAQ", to: "/pricing" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary-deep text-primary-deep-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="GO FARM WORK logo" className="size-9 rounded-full object-cover shadow-sm" />
            <span className="font-display text-base font-extrabold">GO FARM WORK</span>
          </div>
          <p className="mt-4 max-w-xs text-sm opacity-75">
            A trusted marketplace for farm jobs, agricultural services and farming expertise —
            in every Indian language.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-sm font-bold">{col.title}</h3>
            <ul className="mt-4 grid gap-3">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm opacity-75 transition-opacity hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-primary-deep-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} GO FARM WORK. Built for rural India.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/about">Privacy</Link>
            <Link to="/about">Terms</Link>
            <Link to="/auth" search={{ role: "worker" }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
