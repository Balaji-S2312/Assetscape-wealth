import { apiRequest, clearSession, getAccessToken, getStoredUser, saveSession } from "./apiClient";

export async function login(credentials) {
  const payload = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, false);
  saveSession(payload);
  return payload;
}

export async function register(data) {
  const payload = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  }, false);
  saveSession(payload);
  return payload;
}

export async function logout() {
  try {
    await apiRequest("/auth/logout", { method: "POST" }, false);
  } finally {
    clearSession();
  }
}

export function getSession() {
  const accessToken = getAccessToken();
  const user = getStoredUser();
  return accessToken && user ? { accessToken, user } : null;
}

export async function getProfile() {
  return apiRequest("/auth/me");
}

export async function updateProfile(payload) {
  const user = await apiRequest("/users/me", { method: "PUT", body: JSON.stringify(payload) });
  const current = getSession();
  if (current) saveSession({ accessToken: current.accessToken, user });
  return user;
}

export async function changePassword(payload) {
  return apiRequest("/users/me/password", { method: "PUT", body: JSON.stringify(payload) });
}

export async function requestPasswordReset(email) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  }, false);
}

export async function resetPassword(token, newPassword) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  }, false);
}
