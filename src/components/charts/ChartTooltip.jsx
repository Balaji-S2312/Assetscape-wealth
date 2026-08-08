import { useEffect, useRef } from "react";
import gsap from "gsap";
import { formatCurrency } from "@/utils/currency";
import { useCurrency } from "@/context/SettingsContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Shared tooltip that respects the selected display currency. */
export default function ChartTooltip({ active, payload, label, currencyKeys = [], suffix = "" }) {
  const currency = useCurrency();
  const boxRef = useRef(null);
  const reduced = useReducedMotion();
  const key = `${label ?? ""}:${payload?.[0]?.dataKey ?? ""}:${payload?.[0]?.value ?? ""}`;

  useEffect(() => {
    const box = boxRef.current;
    if (!box || reduced || !active) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        box,
        { opacity: 0, y: 8, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "back.out(1.6)" },
      );
      gsap.fromTo(
        box.querySelectorAll("[data-tip-row]"),
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.25, ease: "power2.out", stagger: 0.05, delay: 0.05 },
      );
    }, box);
    return () => ctx.revert();
  }, [key, active, reduced]);

  if (!active || !payload?.length) return null;

  return (
    <div ref={boxRef} className="glass-strong rounded-xl px-3 py-2 text-xs will-change-transform">
      {label ? <p className="mb-1 font-semibold">{label}</p> : null}
      <ul className="space-y-0.5">
        {payload.map((entry) => {
          const isCurrency = currencyKeys.length === 0 || currencyKeys.includes(entry.dataKey);
          return (
            <li
              key={entry.dataKey ?? entry.name}
              data-tip-row
              className="flex items-center gap-2"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color ?? entry.payload?.fill }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="ml-auto font-semibold">
                {isCurrency
                  ? formatCurrency(Math.abs(entry.value), currency)
                  : `${entry.value}${suffix}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
