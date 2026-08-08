import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

const columns: { title: string; items: { label: string; href: string }[] }[] = [
  {
    title: "For Farms",
    items: [
      { label: "How to Hire", href: "#how-it-works" },
      { label: "Post a Job", href: "#for-owners" },
      { label: "Talent Marketplace", href: "#categories" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "For Farmers",
    items: [
      { label: "How to Find Work", href: "#for-workers" },
      { label: "Create Profile", href: "#for-workers" },
      { label: "Find Jobs", href: "#categories" },
      { label: "Get Paid Safely", href: "#faq" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Us", href: "#quote" },
      { label: "Contact Us", href: "#cta" },
      { label: "Trust & Safety", href: "#faq" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary-deep text-primary-deep-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sprout className="size-5" />
            </span>
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
                  <a href={item.href} className="text-sm opacity-75 transition-opacity hover:opacity-100">
                    {item.label}
                  </a>
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
            <a href="#faq">Privacy</a>
            <a href="#faq">Terms</a>
            <Link to="/auth" search={{ role: "worker" }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
