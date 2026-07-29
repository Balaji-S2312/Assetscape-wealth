import { DEMO_CREDENTIALS, mockUser } from "@/data/user";
import { STORAGE_KEYS, readStore, writeStore, clearStore, delay } from "@/utils/storage";

/**
 * Frontend-only auth simulation.
 * Nothing here talks to a provider — swap these four functions for real
 * calls later and the rest of the app is unchanged.
 */
export async function login({ email, password }) {
  await delay(600);
  const matches =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
  if (!matches) {
    throw new Error("Incorrect email or password. Use the demo credentials shown below.");
  }
  const session = { email: DEMO_CREDENTIALS.email, loggedInAt: new Date().toISOString() };
  writeStore(STORAGE_KEYS.auth, session);
  return session;
}

export async function register(payload) {
  await delay(700);
  // Simulated registration: no account is created anywhere.
  const session = { email: payload.email, loggedInAt: new Date().toISOString(), demo: true };
  writeStore(STORAGE_KEYS.auth, session);
  return session;
}

export async function logout() {
  await delay(150);
  clearStore(STORAGE_KEYS.auth);
  return true;
}

export function getSession() {
  return readStore(STORAGE_KEYS.auth, null);
}

export async function requestPasswordReset(email) {
  await delay(650);
  return { message: `A demo reset link would be sent to ${email}.` };
}

export async function getProfile() {
  await delay(250);
  return readStore(STORAGE_KEYS.user, null) ?? mockUser;
}

export async function updateProfile(payload) {
  await delay(450);
  const next = { ...(readStore(STORAGE_KEYS.user, null) ?? mockUser), ...payload };
  writeStore(STORAGE_KEYS.user, next);
  return next;
}
