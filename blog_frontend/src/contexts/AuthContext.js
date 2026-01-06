import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser
} from "../utils/authStorage";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state (user/token) and actions (login/register/logout). */
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Best-effort: if a token exists but no user, try to fetch /me (if backend supports it).
    let mounted = true;

    async function bootstrap() {
      try {
        if (token && !user) {
          const me = await api.me();
          if (mounted && me) {
            setUser(me.user || me);
            setStoredUser(me.user || me);
          }
        }
      } catch {
        // If /me doesn't exist or fails, keep token-only state (backend may not provide /me).
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [token, user]);

  const isAuthenticated = Boolean(token);

  const isAdmin = useMemo(() => {
    // Accept common role fields if backend provides them.
    const role = user?.role || user?.roles?.[0] || user?.isAdmin;
    if (role === true) return true;
    if (typeof role === "string") return role.toLowerCase() === "admin";
    return false;
  }, [user]);

  async function login(credentials) {
    const res = await api.login(credentials);
    const nextToken = res?.token || res?.access_token || res?.accessToken;
    const nextUser = res?.user || res?.profile || res?.me;

    if (!nextToken) {
      throw new Error("Login succeeded but no token was returned by the backend.");
    }

    setToken(nextToken);
    setStoredToken(nextToken);

    if (nextUser) {
      setUser(nextUser);
      setStoredUser(nextUser);
    } else {
      // If backend doesn't return user on login, keep as null (UI still works).
      setUser(null);
      setStoredUser(null);
    }
  }

  async function register(payload) {
    const res = await api.register(payload);
    const nextToken = res?.token || res?.access_token || res?.accessToken;
    const nextUser = res?.user || res?.profile || res?.me;

    if (nextToken) {
      setToken(nextToken);
      setStoredToken(nextToken);
    }

    if (nextUser) {
      setUser(nextUser);
      setStoredUser(nextUser);
    }

    // If backend does not auto-login, caller can redirect to /login.
    return res;
  }

  function logout() {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
