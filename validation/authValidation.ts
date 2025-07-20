import z from "zod";
export const userRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(3, "Minimum length of 3 is required")
      .max(64, "Length cannot exceed 64"),
    email: z.string().email("Invalid Email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 character long")
      .max(128),
    password_confirmation: z.string(),
    role: z.enum(["CANDIDATE", "COMPANY"]),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password and Confirm password must match",
    path: ["password_confirmation"],
  });

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export const emailTokenValidationSchema = z
  .string()
  .length(64)
  .regex(/^[0-9a-f]{64}$/);

export const verifyEmail = z.object({
  email: z.string().email("Email must be a valid email"),
});
