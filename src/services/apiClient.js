const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, "");
const TOKEN_KEY = "assetscape_access_token";
const USER_KEY = "assetscape_user";

let refreshPromise = null;

function browserStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function getAccessToken() {
  return browserStorage()?.getItem(TOKEN_KEY) ?? null;
}

export function getStoredUser() {
  const raw = browserStorage()?.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(payload) {
  const storage = browserStorage();
  if (!storage) return;
  storage.setItem(TOKEN_KEY, payload.accessToken);
  storage.setItem(USER_KEY, JSON.stringify(payload.user));
}

export function clearSession() {
  const storage = browserStorage();
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
  storage.removeItem(USER_KEY);
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return response.text();
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Session expired");
        const payload = await response.json();
        saveSession(payload);
        return payload.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiRequest(path, options = {}, retry = true) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const refreshExcluded = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/forgot-password", "/auth/reset-password"].includes(path);
  if (response.status === 401 && retry && !refreshExcluded) {
    try {
      await refreshAccessToken();
      return apiRequest(path, options, false);
    } catch {
      clearSession();
      if (typeof window !== "undefined") window.dispatchEvent(new Event("assetscape:session-expired"));
    }
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    const message = payload?.message || payload?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.fields = payload?.fields || {};
    throw error;
  }
  return payload;
}

export { API_URL };
