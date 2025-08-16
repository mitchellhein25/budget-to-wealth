import z from "zod";
import { currencyRegex } from "@/app/components";

export const budgetFormSchema = z.object({
  id: z.string().uuid().optional(),
  amount: z.string().trim().min(1, { message: "Amount field is required." })
    .refine(
      (val) => {
        const cleaned = val.replace(/[,\s]/g, '');
        return currencyRegex.test(cleaned);
      },
      { message: "Amount must be a valid currency format (e.g., 100.50)" }
    )
    .transform((val) => {
      return val.replace(/[,\s]/g, '');
    }),
  categoryId: z.string().trim().min(1, { message: "Category field is required" }),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;