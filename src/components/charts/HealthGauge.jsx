import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Radial financial health gauge (0–100). */
export default function HealthGauge({ score = 0, size = 168, label = "Financial health" }) {
  const arcRef = useRef(null);
  const valueRef = useRef(null);
  const reduced = useReducedMotion();

  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));

  useEffect(() => {
    const arc = arcRef.current;
    const value = valueRef.current;
    if (!arc || !value) return undefined;
    const target = circumference - (circumference * clamped) / 100;

    if (reduced) {
      arc.style.strokeDashoffset = String(target);
      value.textContent = String(Math.round(clamped));
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        arc,
        { strokeDashoffset: circumference },
        { strokeDashoffset: target, duration: 1.6, ease: "power3.out" },
      );
      const counter = { v: 0 };
      gsap.to(counter, {
        v: clamped,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => {
          value.textContent = String(Math.round(counter.v));
        },
      });
    });
    return () => ctx.revert();
  }, [clamped, circumference, reduced]);

  const tone = clamped >= 70 ? "var(--positive)" : clamped >= 45 ? "var(--gold)" : "var(--negative)";
  const verdict = clamped >= 70 ? "Strong" : clamped >= 45 ? "Stable" : "Needs attention";

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size / 2 + 16}
        viewBox={`0 0 ${size} ${size / 2 + 16}`}
        role="img"
        aria-label={`${label}: ${Math.round(clamped)} out of 100`}
      >
        <path
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          ref={arcRef}
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke={tone}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div className="-mt-9 text-center">
        <p className="text-3xl font-bold">
          <span ref={valueRef}>0</span>
          <span className="text-base text-muted-foreground">/100</span>
        </p>
        <p className="mt-1 text-xs font-semibold" style={{ color: tone }}>
          {verdict}
        </p>
      </div>
    </div>
  );
}
