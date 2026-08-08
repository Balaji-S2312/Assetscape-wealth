import { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/context/SettingsContext";

/** True when the user (or the settings toggle) prefers reduced motion. */
export function useReducedMotion() {
  const { settings } = useSettings();
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return useMemo(
    () => systemReduced || settings.animations === false,
    [systemReduced, settings.animations],
  );
}
