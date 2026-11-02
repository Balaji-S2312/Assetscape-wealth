import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/mockAuthService";
import { mockUser } from "@/data/user";

/**
 * Demo authentication context.
 * Only a boolean flag lives in localStorage — replace the service calls
 * with a real provider later and this API stays identical.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(mockUser);
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    setSession(authService.getSession());
    authService
      .getProfile()
      .then(setProfile)
      .catch(() => {});
    setInitialising(false);
  }, []);

  const signIn = useCallback(async (credentials) => {
    const next = await authService.login(credentials);
    setSession(next);
    return next;
  }, []);

  const signUp = useCallback(async (payload) => {
    const next = await authService.register(payload);
    setSession(next);
    setProfile((prev) => ({ ...prev, fullName: payload.fullName, email: payload.email }));
    return next;
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const saveProfile = useCallback(async (payload) => {
    const next = await authService.updateProfile(payload);
    setProfile(next);
    return next;
  }, []);

  const value = useMemo(
    () => ({
      session,
      profile,
      initialising,
      isAuthenticated: Boolean(session),
      signIn,
      signUp,
      signOut,
      saveProfile,
      requestPasswordReset: authService.requestPasswordReset,
    }),
    [session, profile, initialising, signIn, signUp, signOut, saveProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
