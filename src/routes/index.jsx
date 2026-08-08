import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShieldCheck, PieChart, TrendingUp, Coffee, Landmark, Gem } from "lucide-react";
import useGsapContext from "@/hooks/useGsapContext";
import ThemeToggle from "@/components/common/ThemeToggle";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assetscape Wealth — Understand Your Assets, Control Your Wealth" },
      {
        name: "description",
        content:
          "Assetscape Wealth is a personal asset management dashboard to track net worth, assets, liabilities and financial health in one warm, elegant space.",
      },
      { property: "og:title", content: "Assetscape Wealth — Personal Asset Management" },
      {
        property: "og:description",
        content: "Track net worth, assets, liabilities and financial health in one polished dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: PieChart, title: "Portfolio clarity", text: "Every asset class layered into one allocation view." },
  { icon: TrendingUp, title: "Net worth trends", text: "Twelve months of history, brewed into insight." },
  { icon: ShieldCheck, title: "Health scoring", text: "Debt-to-asset ratio and liquidity at a glance." },
];

const TILES = [
  { icon: Landmark, label: "Property", value: "£268,400", depth: "translateZ(70px) rotateY(-9deg)" },
  { icon: TrendingUp, label: "Investments", value: "£142,900", depth: "translateZ(30px) rotateY(-3deg)" },
  { icon: Gem, label: "Gold & metals", value: "£48,150", depth: "translateZ(52px) rotateY(6deg)" },
  { icon: Coffee, label: "Everyday cash", value: "£26,800", depth: "translateZ(14px) rotateY(11deg)" },
];

function Landing() {
  const heroLayerRef = useRef(null);

  const scope = useGsapContext(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from("[data-hero] > *", { opacity: 0, y: 28, stagger: 0.09, duration: 0.75 })
      .from(
        "[data-tile]",
        { opacity: 0, y: 60, z: -180, rotateX: 14, stagger: 0.12, duration: 0.9 },
        "-=0.45",
      )
      .from("[data-orb]", { opacity: 0, scale: 0.6, duration: 1.2, stagger: 0.15 }, 0);

    gsap.to("[data-orb='a']", {
      yPercent: 22,
      ease: "none",
      scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: 0.6 },
    });
    gsap.to("[data-orb='b']", {
      yPercent: -18,
      ease: "none",
      scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: 0.6 },
    });

    gsap.utils.toArray("[data-reveal]").forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        y: 44,
        z: -120,
        rotateX: 8,
        duration: 0.85,
        delay: (i % 3) * 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
      });
    });

    const layer = heroLayerRef.current;
    if (layer && window.matchMedia("(pointer: fine)").matches) {
      const move = (e) => {
        const rx = (e.clientY / window.innerHeight - 0.5) * -8;
        const ry = (e.clientX / window.innerWidth - 0.5) * 12;
        gsap.to(layer, { rotateX: rx, rotateY: ry, duration: 0.8, ease: "power2.out" });
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    }
    return undefined;
  });

  return (
    <div ref={scope} className="relative min-h-screen overflow-hidden">
      <div
        data-orb="a"
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-24 h-[26rem] w-[26rem] rounded-full bg-gold/25 blur-3xl"
      />
      <div
        data-orb="b"
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-40 h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-3xl"
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl brand-gradient">
            <Coffee className="h-4.5 w-4.5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="truncate text-lg font-bold">Assetscape Wealth</span>
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

      <main className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <section className="spatial-scene grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div data-hero className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
              Personal wealth, freshly ground
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Understand your assets. <span className="brand-text">Control your wealth.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
              Property, investments, gold, vehicles and debt — layered into one warm, elegant space
              with live net-worth analytics and a financial health score.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                to="/dashboard"
                className="press inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-float)]"
              >
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="press inline-flex items-center rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-secondary"
              >
                Create account
              </Link>
            </div>
          </div>

          <div ref={heroLayerRef} className="grid grid-cols-2 gap-4 [transform-style:preserve-3d]">
            {TILES.map((t, i) => (
              <article
                key={t.label}
                data-tile
                style={{ transform: t.depth }}
                className={`spatial-card grain p-5 ${i % 2 ? "spatial-float mt-8" : ""}`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/20 text-gold-foreground dark:text-gold">
                  <t.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.label}
                </p>
                <p className="mt-1 text-xl font-bold">{t.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="spatial-scene grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} data-reveal className="spatial-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{f.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </section>

        <section data-reveal className="spatial-card mt-8 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Your whole balance sheet, warmly lit.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Everything stays on your device. No accounts to wire up, no data to hand over.
          </p>
          <Link
            to="/dashboard"
            className="press mt-7 inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Explore the dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="relative border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Assetscape Wealth. Demo data only.
      </footer>
    </div>
  );
}
