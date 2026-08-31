import { z } from 'zod';

export const signupSchema = z.object({
    email: z.email(),
    password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Contain at least one special character" }),
    confirmPassword: z.string(),
    name: z.string()
})
.refine((data)=>data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const signinSchema = z.object({
    email: z.email(),
    password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Contain at least one special character" })
});

export type SignupType = z.infer<typeof signupSchema>;
export type SigninType = z.infer<typeof signinSchema>;