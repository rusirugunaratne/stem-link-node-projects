import z from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    nickname: z
      .string()
      .min(2, "Nickname must be at least 2 characters long.")
      .max(30, "Nickname cannot exceed 30 characters.")
      .trim()
      .optional(),
    profileImageUrl: z
      .string()
      .url("Please provide a valid profile image URL.")
      .trim()
      .optional(),
    interestedTagIds: z
      .array(z.number())
      .optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
