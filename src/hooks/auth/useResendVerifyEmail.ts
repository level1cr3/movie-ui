import { resendVerifyEmail } from "@/services/auth";
import type { ResendVerifyEmailRequest } from "@/types/api/authTypes";
import type { ApiError } from "@/types/api/commonTypes";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useResendVerifyEmail = () => {
  return useMutation<void, AxiosError<ApiError>, ResendVerifyEmailRequest>({
    mutationFn: resendVerifyEmail,
  });
};
