import { RecurrenceFrequency } from "@/app/cashflow/components/RecurrenceFrequency";
import { ListTableItem } from "@/app/components";
import { Category } from "@/app/components/categories";

export type ManualInvestmentReturn = ListTableItem & {
  id?: number;
  manualInvestmentCategoryId: string;
  manualInvestmentCategory?: Category;
  manualInvestmentReturnDate: string;
  manualInvestmentPercentageReturn: number;
  manualInvestmentRecurrenceFrequency?: RecurrenceFrequency;
  manualInvestmentRecurrenceEndDate?: string;
  userId?: string;
  name?: string;
}


export const getManualInvestmentReturnDisplayName = (investmentReturn: ManualInvestmentReturn) => {
  return `${investmentReturn.manualInvestmentCategory?.name}`;
}