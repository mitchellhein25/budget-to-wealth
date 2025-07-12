import z from "zod";

export const HoldingFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, { message: "Name field is required." }),
  type: z.string().trim().min(1, { message: "Type field is required." }),
  holdingCategoryId: z.string().trim().min(1, { message: "Category field is required" }),
  institution: z.string().trim()
});

export type HoldingFormData = z.infer<typeof HoldingFormSchema>;