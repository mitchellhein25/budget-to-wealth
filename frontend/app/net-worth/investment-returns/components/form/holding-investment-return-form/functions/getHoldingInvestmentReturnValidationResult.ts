import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "../../";
import { HoldingInvestmentReturnFormSchema } from "..";

export const getHoldingInvestmentReturnValidationResult = (formData: FormData) => {
  const investRetFormId = HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;
  const raw = {
    id: formData.get(`${investRetFormId}-id`) as string || undefined,

    startHoldingSnapshotDate: formData.get(`${investRetFormId}-startHoldingSnapshotDate`) as string || undefined,
    startHoldingSnapshotId: formData.get(`${investRetFormId}-startHoldingSnapshotId`) as string || undefined,

    endHoldingSnapshotHoldingId: formData.get(`${investRetFormId}-endHoldingSnapshotHoldingId`) as string || undefined,
    endHoldingSnapshotDate: formData.get(`${investRetFormId}-endHoldingSnapshotDate`) as string || undefined,
    endHoldingSnapshotBalance: formData.get(`${investRetFormId}-endHoldingSnapshotBalance`) as string || undefined,

    totalContributions: formData.get(`${investRetFormId}-totalContributions`) as string || undefined,
    totalWithdrawals: formData.get(`${investRetFormId}-totalWithdrawals`) as string || undefined,
  };

  return HoldingInvestmentReturnFormSchema.safeParse(raw);
}


