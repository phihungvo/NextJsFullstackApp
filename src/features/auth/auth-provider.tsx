"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { apiRequest, ApiClientError } from "@/lib/api/client";

export type AuthUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly status: string;
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
};

type AuthContextValue = {
  readonly user: AuthUser | null;
  readonly loading: boolean;
  readonly error: ApiClientError | null;
  readonly reload: () => void;
  readonly logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    void apiRequest<{ user: AuthUser }>("/api/v1/auth/me")
      .then((result) => {
        if (active) setUser(result.user);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        if (reason instanceof ApiClientError && reason.status === 401) {
          setUser(null);
          return;
        }
        setError(
          reason instanceof ApiClientError
            ? reason
            : new ApiClientError(0, { message: "Không thể kiểm tra phiên đăng nhập." }),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      reload: () => {
        setLoading(true);
        setError(null);
        setReloadKey((key) => key + 1);
      },
      logout: async () => {
        await apiRequest<{ success: boolean }>("/api/v1/auth/logout", { method: "POST" });
        setUser(null);
      },
    }),
    [error, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải được dùng bên trong AuthProvider.");
  return context;
}
