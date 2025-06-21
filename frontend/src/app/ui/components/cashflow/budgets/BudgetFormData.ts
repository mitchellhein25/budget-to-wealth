import z from "zod";
import { numberRegex } from "../CashFlowUtils";

export const budgetFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, { message: "Name field is required." }),
  amount: z.string().trim().min(1, { message: "Amount field is required." })
    .refine(
      (val) => {
        const cleaned = val.replace(/[,\s]/g, '');
        return numberRegex.test(cleaned);
      },
      { message: "Amount must be a valid currency format (e.g., 100.50)" }
    )
    .refine(
      (val) => {
        const cleaned = val.replace(/[,\s]/g, '');
        const parsed = parseFloat(cleaned);
        return parsed > 0;
      },
      { message: "Amount must be greater than 0" }
    )
    .transform((val) => {
      return val.replace(/[,\s]/g, '');
    }),
  categoryId: z.string().trim().min(1, { message: "Category field is required" }),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;