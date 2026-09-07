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


export const onboardUserSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),

  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(300, 'Bio must be less than 300 characters'),

  nativeLanguage: z
    .string()
    .min(1, 'Please select your native language'),

  learningLanguage: z
    .string()
    .min(1, 'Please select the language you are learning'),

  location: z
    .string()
    .min(1, 'Please enter your location')
    .max(100, 'Location must be less than 100 characters'),

  profilePic: z
    .string()
    .or(z.literal(''))
});

export type OnboardUser = z.infer<typeof onboardUserSchema>;
