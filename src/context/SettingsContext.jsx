import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, readStore, writeStore } from "@/utils/storage";

const DEFAULT_SETTINGS = {
  currency: "INR",
  language: "English (India)",
  notifications: true,
  layout: "comfortable",
  animations: true,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = readStore(STORAGE_KEYS.settings, null);
    if (stored) setSettings({ ...DEFAULT_SETTINGS, ...stored });
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      writeStore(STORAGE_KEYS.settings, next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    writeStore(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  }, []);

  const value = useMemo(
    () => ({ settings, updateSetting, resetSettings, currency: settings.currency }),
    [settings, updateSetting, resetSettings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}

export function useCurrency() {
  return useSettings().currency;
}
