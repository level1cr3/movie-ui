import { login } from "@/services/auth";
import type { LoginRequest, LoginResponse } from "@/types/api/authTypes";
import type { ApiError } from "@/types/api/commonTypes";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError<ApiError>, LoginRequest>({
    mutationFn: login,
  });
};
