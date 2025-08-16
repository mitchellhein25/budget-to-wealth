import { INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "../../constants";
import { InvestmentReturnFormSchema } from "../InvestmentReturnFormData";

export const getInvestmentReturnValidationResult = (formData: FormData) => {
  const investRetFormId = INVESTMENT_RETURN_ITEM_NAME_FORM_ID;
  const raw = {
    id: formData.get(`${investRetFormId}-id`) as string || undefined,
    isManualInvestment: (formData.get(`${investRetFormId}-isManualInvestment`) as string) === 'true',

    manualInvestmentCategoryId: formData.get(`${investRetFormId}-manualInvestmentCategoryId`) as string || undefined,
    manualInvestmentReturnDate: formData.get(`${investRetFormId}-manualInvestmentReturnDate`) as string || undefined,
    manualInvestmentPercentageReturn: formData.get(`${investRetFormId}-manualInvestmentPercentageReturn`) as string || undefined,
    manualInvestmentRecurrenceFrequency: formData.get(`${investRetFormId}-manualInvestmentRecurrenceFrequency`) as string || undefined,
    manualInvestmentRecurrenceEndDate: formData.get(`${investRetFormId}-manualInvestmentRecurrenceEndDate`) as string || undefined,

    startHoldingSnapshotDate: formData.get(`${investRetFormId}-startHoldingSnapshotDate`) as string || undefined,
    startHoldingSnapshotId: formData.get(`${investRetFormId}-startHoldingSnapshotId`) as string || undefined,

    endHoldingSnapshotHoldingId: formData.get(`${investRetFormId}-endHoldingSnapshotHoldingId`) as string || undefined,
    endHoldingSnapshotDate: formData.get(`${investRetFormId}-endHoldingSnapshotDate`) as string || undefined,
    endHoldingSnapshotBalance: formData.get(`${investRetFormId}-endHoldingSnapshotBalance`) as string || undefined,

    totalContributions: formData.get(`${investRetFormId}-totalContributions`) as string || undefined,
    totalWithdrawals: formData.get(`${investRetFormId}-totalWithdrawals`) as string || undefined,
  };

  return InvestmentReturnFormSchema.safeParse(raw);
}


