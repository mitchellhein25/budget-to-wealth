import { RecurrenceFrequency } from "@/app/cashflow";
import { ListTableItem, Category } from "@/app/components";

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