import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(5, "Password must be minimum 5 characters")
  .max(128, "Password cannot exceed 128 characters")
  .regex(
    /[!@#$%^&*]/,
    "Password must contain at least one special character (!@#$%^&*)"
  )
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .refine((p) => !/\s/.test(p), { message: "Password cannot contain spaces" });

export const registrationSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(200),
    lastName: z.string().max(200).optional(),
    email: z.email().max(200),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });
