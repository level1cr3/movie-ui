import { z } from "zod";

export const resendVerifyEmailSchema = z.object({
  email: z.email().max(200),
});
