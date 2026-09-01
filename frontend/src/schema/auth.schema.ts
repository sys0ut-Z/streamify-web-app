import {z} from "zod";

const emailSchema = z
    .string()
    .trim()
    .pipe(z.email({message: "Please enter a valid email"}));

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters"),

  email: emailSchema,

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});
export type SignupRequest = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(1, "Password is required"),
});
export type LoginRequest = z.infer<typeof loginSchema>;

