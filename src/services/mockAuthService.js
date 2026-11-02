import { DEMO_CREDENTIALS, mockUser } from "@/data/user";
import { STORAGE_KEYS, readStore, writeStore, clearStore, delay } from "@/utils/storage";

export async function login({ email, password }) {
  await delay(300);
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
  await delay(300);
  const session = { email: payload.email, loggedInAt: new Date().toISOString() };
  writeStore(STORAGE_KEYS.auth, session);
  return session;
}

export async function logout() {
  await delay(100);
  clearStore(STORAGE_KEYS.auth);
  return true;
}

export function getSession() {
  return readStore(STORAGE_KEYS.auth, null);
}

export async function requestPasswordReset(email) {
  await delay(300);
  return { message: `A password reset link has been dispatched to ${email}.` };
}

export async function getProfile() {
  try {
    const res = await fetch("/api/user");
    if (res.ok) {
      const user = await res.json();
      if (user && user.id) {
        writeStore(STORAGE_KEYS.user, user);
        return user;
      }
    }
  } catch {
    /* fallback to local store */
  }
  await delay(100);
  return readStore(STORAGE_KEYS.user, null) ?? mockUser;
}

export async function updateProfile(payload) {
  await delay(200);
  const next = { ...(readStore(STORAGE_KEYS.user, null) ?? mockUser), ...payload };
  writeStore(STORAGE_KEYS.user, next);
  return next;
}
