import { ManualInvestmentReturn } from "../../../ManualInvestmentReturn";
import { ManualInvestmentReturnFormData } from "../ManualInvestmentReturnFormData";

export const convertManualInvestmentReturnItemToFormData = (item: ManualInvestmentReturn) : ManualInvestmentReturnFormData => ({
  id: item.id?.toString(),
  manualInvestmentCategoryId: item.manualInvestmentCategoryId,
  manualInvestmentReturnDate: new Date(item.manualInvestmentReturnDate),
  manualInvestmentPercentageReturn: item.manualInvestmentPercentageReturn.toString(),
  manualInvestmentRecurrenceFrequency: item.manualInvestmentRecurrenceFrequency,
  manualInvestmentRecurrenceEndDate: item.manualInvestmentRecurrenceEndDate,
});