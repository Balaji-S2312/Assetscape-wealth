/** Shared local-storage helpers. Storage is the only persistence layer. */
export const STORAGE_KEYS = {
  assets: "assetsphere.assets",
  liabilities: "assetsphere.liabilities",
  transactions: "assetsphere.transactions",
  user: "assetsphere.user",
  settings: "assetsphere.settings",
  auth: "assetsphere.auth",
  theme: "assetsphere.theme",
};

export function readStore(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — ignore, state still works in memory */
  }
}

export function clearStore(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Simulated latency so mock services behave like a real API. */
export function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function makeId(prefix) {
  return `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}${Date.now().toString().slice(-3)}`;
}
