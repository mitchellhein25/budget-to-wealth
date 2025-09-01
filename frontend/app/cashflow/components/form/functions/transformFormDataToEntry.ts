import { convertDollarsToCents } from "@/app/components";
import { CashFlowEntry, CashFlowType, getCashFlowValidationResult, RecurrenceFrequency } from "../..";

export const transformCashFlowFormDataToEntry = (formData: FormData, cashFlowType: CashFlowType): { item: CashFlowEntry | null; errors: string[] } => {
  try {
    const validationResult = getCashFlowValidationResult(formData, cashFlowType);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: { message: string }) => err.message);
      return { item: null, errors: [errors[0]] };
    }

    const validatedData = validationResult.data;
    const amountInCents = convertDollarsToCents(validatedData.amount);

    if (amountInCents === null) {
      return { item: null, errors: ["Invalid amount format"] };
    }

    const item: CashFlowEntry = {
      amount: amountInCents,
      date: validatedData.date.toISOString().split('T')[0],
      categoryId: validatedData.categoryId,
      description: validatedData.description || "",
      entryType: cashFlowType,
    };

    if (validatedData.recurrenceFrequency) {
      item.recurrenceFrequency = validatedData.recurrenceFrequency as RecurrenceFrequency;
    }
    
    if (validatedData.recurrenceEndDate) {
      item.recurrenceEndDate = validatedData.recurrenceEndDate;
    }

    return { item, errors: [] };
  } catch (error) {
    let errorMessage = "An unexpected validation error occurred.";
    if (error && typeof error === "object" && "message" in error) {
      errorMessage += `\n${(error as { message: string }).message}`;
    }
    return { item: null, errors: [errorMessage] };
  }
};
