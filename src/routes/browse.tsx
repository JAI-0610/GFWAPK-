import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { IndianRupee, MapPin, Search, Users } from "lucide-react";
import { useState } from "react";

import { MarketingPage } from "@/components/marketing/MarketingPage";
import { listPublicJobs } from "@/lib/public-jobs.functions";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse Farm Jobs Near You — GO FARM WORK" },
      {
        name: "description",
        content:
          "Live farm jobs across India: sowing, harvesting, spraying, dairy and tractor work with daily wages, food and stay details. Apply free.",
      },
      { property: "og:title", content: "Browse Farm Jobs Near You — GO FARM WORK" },
      {
        property: "og:description",
        content: "Live farm jobs with daily wages, perks and secure payments. Apply free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Browse,
});

function Browse() {
  const fetchJobs = useServerFn(listPublicJobs);
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["public-jobs"], queryFn: () => fetchJobs({}) });

  const jobs = (data ?? []).filter((j) =>
    `${j.title} ${j.crop ?? ""} ${j.village ?? ""} ${j.district ?? ""}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );

  return (
    <MarketingPage
      eyebrow="Marketplace"
      title="Browse open farm jobs"
      subtitle="Real work posted by farm owners across India. Sign up free to send a proposal and get paid securely."
    >
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <label className="flex h-14 items-center gap-3 rounded-full border border-border bg-card px-5 shadow-card">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by crop, work or district…"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </label>

        {isLoading ? (
          <p className="mt-10 text-center text-muted-foreground">Loading jobs…</p>
        ) : jobs.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-10 text-center">
            <p className="font-display text-xl font-bold text-card-foreground">
              No open jobs match your search yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              New work is posted every day. Create a free profile to get alerts for your village.
            </p>
            <Link
              to="/auth"
              search={{ role: "worker" }}
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              Create free profile
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => {
              const place = [job.village, job.district].filter(Boolean).join(", ");
              const perks = [
                job.food_provided && "Food",
                job.stay_provided && "Stay",
                job.transport_provided && "Transport",
                job.tools_provided && "Tools",
              ].filter(Boolean) as string[];
              return (
                <article
                  key={job.id}
                  className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-lg font-bold text-card-foreground">
                        {job.title}
                      </h2>
                      {job.crop ? (
                        <p className="text-sm text-muted-foreground">{job.crop}</p>
                      ) : null}
                    </div>
                    <span className="flex shrink-0 items-center rounded-2xl bg-money px-3 py-1.5 text-money-foreground">
                      <IndianRupee className="size-4" />
                      <span className="text-xl font-extrabold leading-none">
                        {Number(job.wage_amount)}
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    {place ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                        <MapPin className="size-3.5" /> {place}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                      <Users className="size-3.5" /> {job.crew_size} needed
                    </span>
                    {perks.map((p) => (
                      <span
                        key={p}
                        className="rounded-full bg-primary/12 px-2.5 py-1 text-primary"
                      >
                        {p}
                      </span>
                    ))}
                    {job.escrow_funded ? (
                      <span className="rounded-full bg-primary/12 px-2.5 py-1 text-primary">
                        🔒 Wage secured
                      </span>
                    ) : null}
                  </div>

                  <Link
                    to="/auth"
                    search={{ role: "worker" }}
                    className="mt-6 inline-flex justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground active:scale-95"
                  >
                    Apply free
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </MarketingPage>
  );
}
