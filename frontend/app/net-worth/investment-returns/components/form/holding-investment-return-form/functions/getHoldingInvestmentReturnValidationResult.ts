import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "../../";
import { HoldingInvestmentReturnFormSchema } from "..";

export const getHoldingInvestmentReturnValidationResult = (formData: FormData) => {
  const investRetFormId = HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;
  const raw = {
    id: formData.get(`${investRetFormId}-id`) as string || undefined,
    startHoldingSnapshotDate: (new Date(formData.get(`${investRetFormId}-startHoldingSnapshotDate`) as string)) || '',
    startHoldingSnapshotId: (formData.get(`${investRetFormId}-startHoldingSnapshotId`) as string) || '',
    endHoldingSnapshotId: (formData.get(`${investRetFormId}-endHoldingSnapshotId`) as string) || '',
    endHoldingSnapshotHoldingId: (formData.get(`${investRetFormId}-endHoldingSnapshotHoldingId`) as string) || '',
    endHoldingSnapshotDate: (new Date(formData.get(`${investRetFormId}-endHoldingSnapshotDate`) as string)) || '',
    endHoldingSnapshotBalance: (formData.get(`${investRetFormId}-endHoldingSnapshotBalance`) as string) || '',

    totalContributions: formData.get(`${investRetFormId}-totalContributions`) as string || undefined,
    totalWithdrawals: formData.get(`${investRetFormId}-totalWithdrawals`) as string || undefined,
  };

  return HoldingInvestmentReturnFormSchema.safeParse(raw);
}


