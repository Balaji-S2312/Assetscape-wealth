import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import { formatCurrency } from "@/utils/currency";
import { useCurrency } from "@/context/SettingsContext";

/**
 * Financial stat card with a GSAP-driven counter.
 * `value` is always GBP; display currency is applied while counting.
 */
export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  suffix,
  percent = false,
  hint,
  delay = 0,
}) {
  const numberRef = useRef(null);
  const reduced = useReducedMotion();
  const currency = useCurrency();

  useEffect(() => {
    const node = numberRef.current;
    if (!node) return undefined;
    if (reduced) {
      node.textContent = percent
        ? `${Number(value).toFixed(1)}%`
        : formatCurrency(value, currency);
      return undefined;
    }
    const ctx = gsap.context(() => {
      const counter = { current: 0 };
      gsap.to(counter, {
        current: Number(value) || 0,
        duration: 1.4,
        delay,
        ease: "power2.out",
        onUpdate: () => {
          node.textContent = percent
            ? `${counter.current.toFixed(1)}%`
            : formatCurrency(counter.current, currency);
        },
      });
    });
    return () => ctx.revert();
  }, [value, currency, percent, reduced, delay]);

  const toneClass =
    tone === "positive"
      ? "text-positive bg-positive/12"
      : tone === "negative"
        ? "text-negative bg-negative/12"
        : tone === "gold"
          ? "text-gold bg-gold/15"
          : tone === "info"
            ? "text-info bg-info/12"
            : "text-primary bg-primary/12";

  return (
    <article
      data-stat-card
      className="glass press group relative overflow-hidden rounded-2xl p-5"
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full glow-bg opacity-70" />
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm font-medium text-muted-foreground">{label}</p>
        {Icon ? (
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneClass}`}>
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 truncate text-2xl font-bold tracking-tight sm:text-[1.7rem]">
        <span ref={numberRef}>
          {percent ? `${Number(value).toFixed(1)}%` : <CurrencyDisplay value={value} />}
        </span>
        {suffix ? <span className="ml-1 text-sm text-muted-foreground">{suffix}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </article>
  );
}
