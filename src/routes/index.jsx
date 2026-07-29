import { createFileRoute, Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ArrowRight, ShieldCheck, PieChart, TrendingUp, Sparkles } from "lucide-react";
import useGsapContext from "@/hooks/useGsapContext";
import ThemeToggle from "@/components/common/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AssetSphere — Understand Your Assets, Control Your Wealth" },
      {
        name: "description",
        content:
          "AssetSphere is a personal asset management dashboard to track net worth, assets, liabilities and financial health in one place.",
      },
      { property: "og:title", content: "AssetSphere — Personal Asset Management" },
      {
        property: "og:description",
        content: "Track net worth, assets, liabilities and financial health in one polished dashboard.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: PieChart, title: "Portfolio clarity", text: "See every asset class in one allocation view." },
  { icon: TrendingUp, title: "Net worth trends", text: "Twelve-month history with growth insights." },
  { icon: ShieldCheck, title: "Health scoring", text: "Debt-to-asset ratio and liquidity at a glance." },
];

function Landing() {
  const scope = useGsapContext(() => {
    gsap.from("[data-hero] > *", { opacity: 0, y: 24, stagger: 0.09, duration: 0.7, ease: "power3.out" });
  });

  return (
    <div ref={scope} className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl brand-gradient">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="truncate text-lg font-bold">AssetSphere</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            to="/login"
            className="press rounded-xl border border-border px-3.5 py-2 text-sm font-semibold hover:bg-secondary"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <section data-hero className="py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
            Personal wealth, fully mapped
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Understand your assets. <span className="brand-text">Control your wealth.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Track property, investments, gold, vehicles and debt in one elegant dashboard — with live
            net-worth analytics and a financial health score.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="press inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="press inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-secondary"
            >
              Create account
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="glass rounded-2xl p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{f.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AssetSphere. Demo data only.
      </footer>
    </div>
  );
}
