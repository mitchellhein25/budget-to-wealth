import { CashFlowEntry } from "@/app/lib/models/CashFlow/CashFlowEntry";
import { CashFlowType } from "@/app/lib/models/CashFlow/CashFlowType";
import { getCashFlowValidationResult } from "./getCashFlowValidationResult";
import { convertDollarsToCents } from "./CashFlowUtils";

export const transformFormDataToEntry = (formData: FormData, cashFlowType: CashFlowType): { entry: CashFlowEntry | null; errors: string[] } => {
  try {
    const validationResult = getCashFlowValidationResult(formData, cashFlowType);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message);
      return { entry: null, errors: [errors[0]] };
    }

    const validatedData = validationResult.data;
    const amountInCents = convertDollarsToCents(validatedData.amount);

    if (amountInCents === null) {
      return { entry: null, errors: ["Invalid amount format"] };
    }

    const entry: CashFlowEntry = {
      amount: amountInCents,
      date: validatedData.date.toISOString().split('T')[0],
      categoryId: validatedData.categoryId,
      description: validatedData.description || "",
      entryType: cashFlowType
    };

    return { entry, errors: [] };
  } catch (error) {
    return { entry: null, errors: ["An unexpected validation error occurred"] };
  }
};