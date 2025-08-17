import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "../../";
import { ManualInvestmentReturnFormSchema } from "..";

export const getManualInvestmentReturnValidationResult = (formData: FormData) => {
  const investRetFormId = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;
  const raw = {
    id: formData.get(`${investRetFormId}-id`) as string || undefined,

    manualInvestmentCategoryId: formData.get(`${investRetFormId}-manualInvestmentCategoryId`) as string || undefined,
    manualInvestmentReturnDate: formData.get(`${investRetFormId}-manualInvestmentReturnDate`) as string || undefined,
    manualInvestmentPercentageReturn: formData.get(`${investRetFormId}-manualInvestmentPercentageReturn`) as string || undefined,
    manualInvestmentRecurrenceFrequency: formData.get(`${investRetFormId}-manualInvestmentRecurrenceFrequency`) as string || undefined,
    manualInvestmentRecurrenceEndDate: formData.get(`${investRetFormId}-manualInvestmentRecurrenceEndDate`) as string || undefined
  };

  return ManualInvestmentReturnFormSchema.safeParse(raw);
}


