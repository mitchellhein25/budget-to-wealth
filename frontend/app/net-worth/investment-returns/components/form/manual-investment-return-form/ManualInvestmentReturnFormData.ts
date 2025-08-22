import z from "zod";
import { RecurrenceFrequency } from "@/app/cashflow/components";

export const ManualInvestmentReturnFormSchema = z.object({
  id: z.string().uuid().optional(),
  manualInvestmentCategoryId: z.string().min(1, { message: "Category field is required" }),
  manualInvestmentReturnDate: z.date({ message: "Return date field is required." }),
  manualInvestmentPercentageReturn: z.string().min(1, { message: "Percentage return field is required" }),
  manualInvestmentRecurrenceFrequency: z.nativeEnum(RecurrenceFrequency).optional(),
  manualInvestmentRecurrenceEndDate: z.string().optional(),
});

export type ManualInvestmentReturnFormData = z.infer<typeof ManualInvestmentReturnFormSchema>;


