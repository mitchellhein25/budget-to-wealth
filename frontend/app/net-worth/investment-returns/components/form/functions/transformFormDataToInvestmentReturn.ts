import { convertDollarsToCents } from "@/app/components/Utils";
import { InvestmentReturn } from "../../InvestmentReturn";
import { getInvestmentReturnValidationResult } from "./getInvestmentReturnValidationResult";
import { INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "../../constants";

export const transformFormDataToInvestmentReturn = (formData: FormData): { item: InvestmentReturn | null; errors: string[] } => {
  try {
    const validation = getInvestmentReturnValidationResult(formData);
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message);
      return { item: null, errors: [errors[0]] };
    }

    const data = validation.data;
    const isManual = Boolean(data.isManualInvestment);

    const item: InvestmentReturn = {} as InvestmentReturn;

    if (isManual) {
      if (!data.manualInvestmentCategoryId) 
        return { item: null, errors: ["Manual investment category is required."] };
      if (!data.manualInvestmentReturnDate) 
        return { item: null, errors: ["Manual investment date is required."] };
      if (!data.manualInvestmentPercentageReturn) 
        return { item: null, errors: ["Manual investment % return is required."] };

      item.manualInvestmentCategoryId = data.manualInvestmentCategoryId;
      item.manualInvestmentReturnDate = data.manualInvestmentReturnDate;
      item.manualInvestmentPercentageReturn = parseFloat(data.manualInvestmentPercentageReturn);
      if (data.manualInvestmentRecurrenceFrequency) {
        item.manualInvestmentRecurrenceFrequency = data.manualInvestmentRecurrenceFrequency;
        if (data.manualInvestmentRecurrenceEndDate) 
          item.manualInvestmentRecurrenceEndDate = data.manualInvestmentRecurrenceEndDate;
      }
      if (item.startHoldingSnapshotId) 
        item.startHoldingSnapshotId = undefined;
      if (item.endHoldingSnapshotId) item.endHoldingSnapshotId = undefined;
      item.totalContributions = undefined;
      item.totalWithdrawals = undefined;
      item.returnPercentage = undefined;
    } else {
      if (!data.startHoldingSnapshotId) return { item: null, errors: ["Start snapshot is required."] };
      if (!data.endHoldingSnapshotHoldingId || !data.endHoldingSnapshotDate || !data.endHoldingSnapshotBalance) return { item: null, errors: ["End snapshot fields are required."] };

      item.startHoldingSnapshotId = data.startHoldingSnapshotId;
      // For end snapshot, the page flow will create it first and set id in formData externally before submit if needed.
      const endId = formData.get(`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotId`) as string | null;
      if (endId) 
        item.endHoldingSnapshotId = endId;
    }

    const totalContribCents = data.totalContributions ? convertDollarsToCents(data.totalContributions) : null;
    const totalWithdrawCents = data.totalWithdrawals ? convertDollarsToCents(data.totalWithdrawals) : null;
    if (isManual && (totalContribCents == null || totalWithdrawCents == null)) {
      return { item: null, errors: ["Invalid currency input."] };
    }

    return { item, errors: [] };
  } catch (error) {
    let errorMessage = "An unexpected validation error occurred.";
    if (error && typeof error === "object" && "message" in error) {
      errorMessage += `\n${(error as { message: string }).message}`;
    }
    return { item: null, errors: [errorMessage] };
  }
}


