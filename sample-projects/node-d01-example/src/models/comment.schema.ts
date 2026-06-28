import z from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    message: z
      .string({ message: "Comment message is required." })
      .min(1, "Comment message cannot be empty.")
      .max(1000, "Comment cannot exceed 1000 characters.")
      .trim(),
  }),
  params: z.object({
    submissionId: z.string().transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Submission ID must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});

export const getCommentsSchema = z.object({
  params: z.object({
    submissionId: z.string().transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Submission ID must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});

export const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ID must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];
