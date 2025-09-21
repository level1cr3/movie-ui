import { z } from "zod";

export const emailSchema = z.object({
  email: z.email().max(200),
});
