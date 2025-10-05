import { z } from "zod";
import { passwordSchema } from "./registrationSchema";

export const loginSchema = z.object({
  email: z.email().max(200),
  password: passwordSchema,
});
