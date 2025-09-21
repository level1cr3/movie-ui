import api from "./apiClient";
import type {
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerifyEmailRequest,
  ForgotPasswordRequest,
} from "@/types/api/authTypes";

export const register = async (newUser: RegisterRequest): Promise<void> => {
  await api.post("/auth/register", newUser);
};

export const verifyEmail = async (
  verifyEmail: VerifyEmailRequest
): Promise<void> => {
  await api.post("/auth/confirm-email", verifyEmail);
};

export const resendVerifyEmail = async (
  resendVerifyEmail: ResendVerifyEmailRequest
): Promise<void> => {
  await api.post("/auth/resend-confirm-email", resendVerifyEmail);
};

export const forgotPassword = async (
  forgotPassword: ForgotPasswordRequest
): Promise<void> => {
  await api.post("/auth/forgot-password", forgotPassword);
};

/*
Your ASP.NET Core AuthController exposes a contract (endpoints: /auth/register, /auth/login, /auth/refresh, etc.).

Your authService.ts is the frontend client for those endpoints.

Your React hooks (useRegister, useLogin, useRefreshToken) wrap those services and add React Query’s cache/state management.

*/
