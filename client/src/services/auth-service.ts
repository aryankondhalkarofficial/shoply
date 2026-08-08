import { apiRequest } from "./api-client";
import type { User } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

type UserResponse = { user?: User; data?: User } & Partial<User>;

function unwrapUser(res: UserResponse): User {
  return (res.user ?? res.data ?? (res as unknown as User)) as User;
}

export const authService = {
  register: async (payload: RegisterPayload) =>
    unwrapUser(await apiRequest<UserResponse>("/api/users/register", { method: "POST", body: payload })),

  login: async (payload: { email: string; password: string }) =>
    unwrapUser(await apiRequest<UserResponse>("/api/users/login", { method: "POST", body: payload })),

  me: async () => unwrapUser(await apiRequest<UserResponse>("/api/users/me")),

  logout: async () => {
    try {
      await apiRequest("/api/users/logout", { method: "POST" });
    } catch {
      // Backend may expose logout under a different verb/path; session cookie
      // expiry still applies and local auth state is cleared by the caller.
    }
  },
};