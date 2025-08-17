import { RecurrenceFrequency } from "@/app/cashflow/components";
import { Category } from "@/app/components/categories";

export type ManualInvestmentReturn = {
  id?: number;
  manualInvestmentCategoryId: string;
  manualInvestmentCategory?: Category;
  manualInvestmentReturnDate: string;
  manualInvestmentPercentageReturn: number;
  manualInvestmentRecurrenceFrequency?: RecurrenceFrequency;
  manualInvestmentRecurrenceEndDate?: string;
  userId?: string;
}