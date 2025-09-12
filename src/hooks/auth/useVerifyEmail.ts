import { verifyEmail } from "@/services/auth";
import type { VerifyEmailRequest } from "@/types/api/authTypes";
import type { ApiError } from "@/types/api/commonTypes";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useVerifyEmail = () => {
  return useMutation<void, AxiosError<ApiError>, VerifyEmailRequest>({
    mutationFn: verifyEmail,
    retry: (failureCount, error) => {
      // retry only if it's network error.
      if (!error.response) {
        return failureCount < 2;
      }
      return false;
    },
  });
};

/*
#> Why retry is used even though it is considered bad in mutaion ?

> This mutation is basically an idempotent action:

> we are sending { userId, token } → server checks the token, flips a flag (EmailConfirmed = true) if valid.

> If we retry the same request:

> If it already succeeded → backend just says “already verified”.

> If it failed due to network → retry can succeed.

> If it failed due to invalid/expired token → retry still fails (safe).

> So retrying does not create duplicates or unsafe side effects.

> 👉 That makes it one of the rare mutations where retry is okay — in fact, it improves UX against flaky networks.


*/
