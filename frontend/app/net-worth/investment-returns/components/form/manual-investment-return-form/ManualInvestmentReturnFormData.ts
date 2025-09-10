import { RecurrenceFrequency } from "@/app/cashflow/components/RecurrenceFrequency";
import z from "zod";

export const ManualInvestmentReturnFormSchema = z.object({
  id: z.string().uuid().optional(),
  manualInvestmentCategoryId: z.string().min(1, { message: "Category field is required" }),
  manualInvestmentReturnDate: z.date({ message: "Return date field is required." }),
  manualInvestmentPercentageReturn: z.string().min(1, { message: "Percentage return field is required" }),
  manualInvestmentRecurrenceFrequency: z.enum(Object.values(RecurrenceFrequency) as [string, ...string[]]).optional(),
  manualInvestmentRecurrenceEndDate: z.string().optional(),
});

export type ManualInvestmentReturnFormData = z.infer<typeof ManualInvestmentReturnFormSchema>;


