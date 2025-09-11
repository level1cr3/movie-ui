import api from "./apiClient";

export type RegisterRequest = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
};

export const register = async (newUser: RegisterRequest): Promise<void> => {
  await api.post("/api/auth/register", newUser);
};

/*
Your ASP.NET Core AuthController exposes a contract (endpoints: /auth/register, /auth/login, /auth/refresh, etc.).

Your authService.ts is the frontend client for those endpoints.

Your React hooks (useRegister, useLogin, useRefreshToken) wrap those services and add React Query’s cache/state management.

*/
