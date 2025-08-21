import { convertDollarsToCents } from "@/app/components/Utils";
import { getHoldingInvestmentReturnValidationResult } from "..";
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "../../";
import { HoldingInvestmentReturn } from "../../../HoldingInvestmentReturn";

export const transformFormDataToHoldingInvestmentReturn = (formData: FormData): { item: HoldingInvestmentReturn | null; errors: string[] } => {
    try {
    const validation = getHoldingInvestmentReturnValidationResult(formData);
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message);
      return { item: null, errors: [errors[0]] };
    }

    const data = validation.data;

    const item: HoldingInvestmentReturn = {} as HoldingInvestmentReturn;

    item.startHoldingSnapshotId = data.startHoldingSnapshotId;
    // For end snapshot, the page flow will create it first and set id in formData externally before submit if needed.
    const endId = formData.get(`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotId`) as string;
    item.endHoldingSnapshotId = endId;

    item.totalContributions = convertDollarsToCents(data.totalContributions) || 0;
    item.totalWithdrawals = convertDollarsToCents(data.totalWithdrawals) || 0;

    return { item, errors: [] };
  } catch (error) {
    let errorMessage = "An unexpected validation error occurred.";
    if (error && typeof error === "object" && "message" in error) {
      errorMessage += `\n${(error as { message: string }).message}`;
    }
    return { item: null, errors: [errorMessage] };
  }
}


