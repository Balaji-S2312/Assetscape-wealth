import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Animates the rendered Recharts SVG series with GSAP.
 * Replays whenever `signature` changes (mount, data updates, filter changes).
 *
 * Returns a ref to attach to the chart wrapper element.
 */
export function useChartAnimation(signature = "", { delay = 0 } = {}) {
  const scope = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = scope.current;
    if (!root || reduced) return undefined;

    let ctx;
    let raf1;
    let raf2;

    // Wait two frames so ResponsiveContainer has measured + painted the series.
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        ctx = gsap.context(() => {
          const q = (sel) => Array.from(root.querySelectorAll(sel));

          // --- Bars: grow from the axis ---
          const bars = q(".recharts-bar-rectangle");
          if (bars.length) {
            gsap.fromTo(
              bars,
              { scaleY: 0, opacity: 0.2, transformOrigin: "50% 100%" },
              {
                scaleY: 1,
                opacity: 1,
                duration: 0.7,
                delay,
                ease: "power3.out",
                stagger: { each: 0.04, from: "start" },
              },
            );
          }

          // --- Lines & area outlines: draw the stroke ---
          const strokes = q(".recharts-line-curve, .recharts-area-curve");
          strokes.forEach((path, i) => {
            let length = 0;
            try {
              length = path.getTotalLength();
            } catch {
              length = 0;
            }
            if (!length) return;
            gsap.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length, opacity: 1 },
              {
                strokeDashoffset: 0,
                duration: 1.15,
                delay: delay + i * 0.12,
                ease: "power2.inOut",
                clearProps: "strokeDasharray,strokeDashoffset",
              },
            );
          });

          // --- Area fills: rise from the baseline ---
          const areas = q(".recharts-area-area");
          if (areas.length) {
            gsap.fromTo(
              areas,
              { opacity: 0, scaleY: 0.72, transformOrigin: "50% 100%" },
              {
                opacity: 1,
                scaleY: 1,
                duration: 0.9,
                delay: delay + 0.15,
                ease: "power2.out",
                stagger: 0.1,
              },
            );
          }

          // --- Dots / active markers ---
          const dots = q(".recharts-line-dots circle, .recharts-scatter-symbol");
          if (dots.length) {
            gsap.fromTo(
              dots,
              { scale: 0, transformOrigin: "50% 50%" },
              { scale: 1, duration: 0.4, delay: delay + 0.5, ease: "back.out(2)", stagger: 0.02 },
            );
          }

          // --- Pie / donut sectors: sweep in ---
          const sectors = q(".recharts-pie-sector");
          if (sectors.length) {
            gsap.fromTo(
              sectors,
              { opacity: 0, scale: 0.82, transformOrigin: "50% 50%" },
              {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                delay,
                ease: "back.out(1.4)",
                stagger: 0.05,
              },
            );
          }

          // --- Radial bars (gauges) ---
          const radial = q(".recharts-radial-bar-sector");
          if (radial.length) {
            gsap.fromTo(
              radial,
              { opacity: 0, scale: 0.88, transformOrigin: "50% 50%" },
              { opacity: 1, scale: 1, duration: 0.7, delay, ease: "power3.out", stagger: 0.06 },
            );
          }

          // --- Supporting chrome: axes, grid, legend ---
          const chrome = q(
            ".recharts-cartesian-grid, .recharts-cartesian-axis, .recharts-legend-wrapper",
          );
          if (chrome.length) {
            gsap.fromTo(
              chrome,
              { opacity: 0 },
              { opacity: 1, duration: 0.5, delay, ease: "power1.out" },
            );
          }
        }, scope);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ctx?.revert();
    };
  }, [signature, reduced, delay]);

  return scope;
}

/** Builds a stable string signature from chart data + filter values. */
export function chartSignature(...parts) {
  return parts
    .map((p) => {
      if (Array.isArray(p)) return `${p.length}:${JSON.stringify(p[0] ?? "")}${JSON.stringify(p[p.length - 1] ?? "")}`;
      if (p && typeof p === "object") return JSON.stringify(p);
      return String(p);
    })
    .join("|");
}

export default useChartAnimation;
