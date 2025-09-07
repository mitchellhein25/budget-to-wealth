import { ManualInvestmentReturnFormData, ManualInvestmentReturn } from "@/app/net-worth/investment-returns";

export const convertManualInvestmentReturnItemToFormData = (item: ManualInvestmentReturn) : ManualInvestmentReturnFormData => ({
  id: item.id?.toString(),
  manualInvestmentCategoryId: item.manualInvestmentCategoryId,
  manualInvestmentReturnDate: new Date(item.manualInvestmentReturnDate),
  manualInvestmentPercentageReturn: item.manualInvestmentPercentageReturn.toString(),
  manualInvestmentRecurrenceFrequency: item.manualInvestmentRecurrenceFrequency,
  manualInvestmentRecurrenceEndDate: item.manualInvestmentRecurrenceEndDate,
});