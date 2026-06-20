import z from "zod";

// Whitelist validation for updating profile fields safely
export const updateProfileSchema = z.object({
  body: z.object({
    nickname: z
      .string()
      .min(2, "Nickname must be at least 2 characters long.")
      .max(30, "Nickname cannot exceed 30 characters.")
      .trim()
      .optional(),
    profileImageUrl: z
      .string()
      .url("Please provide a valid URL string for the profile image.")
      .trim()
      .optional(),
  }),
});

// Infer the TypeScript type from our Zod validation rules
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
