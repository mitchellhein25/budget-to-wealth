import { getManualInvestmentReturnValidationResult } from "..";
import { ManualInvestmentReturn } from "../../../ManualInvestmentReturn";

export const transformFormDataToManualInvestmentReturn = (formData: FormData): { item: ManualInvestmentReturn | null; errors: string[] } => {
  try {
    const validation = getManualInvestmentReturnValidationResult(formData);
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message);
      return { item: null, errors: [errors[0]] };
    }

    const data = validation.data;
    const item: ManualInvestmentReturn = {} as ManualInvestmentReturn;

    item.manualInvestmentCategoryId = data.manualInvestmentCategoryId;
    item.manualInvestmentReturnDate = data.manualInvestmentReturnDate;
    item.manualInvestmentPercentageReturn = parseFloat(data.manualInvestmentPercentageReturn);
    if (data.manualInvestmentRecurrenceFrequency) {
      item.manualInvestmentRecurrenceFrequency = data.manualInvestmentRecurrenceFrequency;
      if (data.manualInvestmentRecurrenceEndDate) 
        item.manualInvestmentRecurrenceEndDate = data.manualInvestmentRecurrenceEndDate;
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


