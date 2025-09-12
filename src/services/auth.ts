import api from "./apiClient";
import type {
  RegisterRequest,
  VerifyEmailRequest,
} from "@/types/api/authTypes";

export const register = async (newUser: RegisterRequest): Promise<void> => {
  await api.post("/auth/register", newUser);
};

export const verifyEmail = async (
  verifyEmail: VerifyEmailRequest
): Promise<void> => {
  await api.post("/auth/confirm-email", verifyEmail);
};

/*
Your ASP.NET Core AuthController exposes a contract (endpoints: /auth/register, /auth/login, /auth/refresh, etc.).

Your authService.ts is the frontend client for those endpoints.

Your React hooks (useRegister, useLogin, useRefreshToken) wrap those services and add React Query’s cache/state management.

*/
