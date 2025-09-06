import z from "zod";
import { currencyRegex } from "@/app/components";
import { RecurrenceFrequency } from "../..";

export const cashFlowEntryFormSchema = z.object({
  id: z.string().uuid().optional(),
  amount: z.string().trim().min(1, { message: "Amount field is required." })
    .refine(
      (val) => {
        const cleaned = val.replace(/[,\s]/g, '');
        return currencyRegex.test(cleaned);
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
  date: z.date({ message: "Date field is required." }).nullable().refine((val) => val !== null, { message: "Date field is required." }),
  categoryId: z.string().trim().min(1, { message: "Category field is required" }),
  description: z.string().trim().optional(),
  recurrenceFrequency: z.enum(Object.values(RecurrenceFrequency) as [string, ...string[]]).optional(),
  recurrenceEndDate: z.string().optional(),
});

export type CashFlowEntryFormData = z.infer<typeof cashFlowEntryFormSchema>;