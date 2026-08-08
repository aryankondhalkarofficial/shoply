import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, type ReactNode } from "react";

import { authService, type RegisterPayload } from "@/services/auth-service";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const currentUserQueryKey = ["auth", "me"] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      try {
        return await authService.me();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 60_000,
  });

  const user = data ?? null;

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
  }, [queryClient]);

  const login = useCallback(
    async (email: string, password: string) => {
      const loggedIn = await authService.login({ email, password });
      queryClient.setQueryData(currentUserQueryKey, loggedIn ?? null);
      await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
    [queryClient],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const created = await authService.register(payload);
      queryClient.setQueryData(currentUserQueryKey, created ?? null);
      await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    queryClient.setQueryData(currentUserQueryKey, null);
    queryClient.removeQueries({ queryKey: ["cart"] });
    queryClient.removeQueries({ queryKey: ["orders"] });
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        isAuthenticated: Boolean(user?._id ?? user?.email),
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}