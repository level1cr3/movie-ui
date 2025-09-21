import { forgotPassword } from "@/services/auth";
import type { ForgotPasswordRequest } from "@/types/api/authTypes";
import type { ApiError } from "@/types/api/commonTypes";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useForgotPassword = () => {
  return useMutation<void, AxiosError<ApiError>, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
  });
};
