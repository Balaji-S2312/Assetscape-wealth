import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession());
  const [profile, setProfile] = useState(() => authService.getSession()?.user ?? null);
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    let active = true;
    async function restore() {
      if (!authService.getSession()) {
        if (active) setInitialising(false);
        return;
      }
      try {
        const user = await authService.getProfile();
        if (active) {
          setProfile(user);
          setSession(authService.getSession());
        }
      } catch {
        if (active) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (active) setInitialising(false);
      }
    }
    restore();
    const expire = () => {
      setSession(null);
      setProfile(null);
    };
    window.addEventListener("assetscape:session-expired", expire);
    return () => {
      active = false;
      window.removeEventListener("assetscape:session-expired", expire);
    };
  }, []);

  const signIn = useCallback(async (credentials) => {
    const payload = await authService.login(credentials);
    setSession({ accessToken: payload.accessToken, user: payload.user });
    setProfile(payload.user);
    return payload;
  }, []);

  const signUp = useCallback(async (payload) => {
    const result = await authService.register(payload);
    setSession({ accessToken: result.accessToken, user: result.user });
    setProfile(result.user);
    return result;
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setSession(null);
    setProfile(null);
  }, []);

  const saveProfile = useCallback(async (payload) => {
    const next = await authService.updateProfile(payload);
    setProfile(next);
    setSession(authService.getSession());
    return next;
  }, []);

  const value = useMemo(() => ({
    session,
    profile,
    initialising,
    isAuthenticated: Boolean(session),
    signIn,
    signUp,
    signOut,
    saveProfile,
    changePassword: authService.changePassword,
    requestPasswordReset: authService.requestPasswordReset,
    resetPassword: authService.resetPassword,
  }), [session, profile, initialising, signIn, signUp, signOut, saveProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
