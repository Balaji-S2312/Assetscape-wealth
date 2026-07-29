import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs a GSAP animation setup inside gsap.context() scoped to a ref,
 * cleaning everything up on unmount. Skipped when reduced motion is on.
 */
export function useGsapContext(setup, deps = []) {
  const scope = useRef(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced || !scope.current) return undefined;
    const ctx = gsap.context(setup, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return scope;
}

export default useGsapContext;
