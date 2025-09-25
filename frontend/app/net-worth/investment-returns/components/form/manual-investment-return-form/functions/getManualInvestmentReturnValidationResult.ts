import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, ManualInvestmentReturnFormSchema } from "@/app/net-worth/investment-returns";

export const getManualInvestmentReturnValidationResult = (formData: FormData) => {
  const investRetFormId = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;
  const raw = {
    id: formData.get(`${investRetFormId}-id`) as string || undefined,

    manualInvestmentCategoryId: formData.get(`${investRetFormId}-manualInvestmentCategoryId`) as string || undefined,
    startDate: formData.get(`${investRetFormId}-startDate`) ? new Date(formData.get(`${investRetFormId}-startDate`) as string) : undefined,
    endDate: formData.get(`${investRetFormId}-endDate`) ? new Date(formData.get(`${investRetFormId}-endDate`) as string) : undefined,
    manualInvestmentPercentageReturn: formData.get(`${investRetFormId}-manualInvestmentPercentageReturn`) as string || undefined,
    manualInvestmentRecurrenceFrequency: formData.get(`${investRetFormId}-manualInvestmentRecurrenceFrequency`) as string || undefined,
    manualInvestmentRecurrenceEndDate: formData.get(`${investRetFormId}-manualInvestmentRecurrenceEndDate`) as string || undefined
  };

  return ManualInvestmentReturnFormSchema.safeParse(raw);
}


