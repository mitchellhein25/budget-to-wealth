import { CashFlowEntry } from "@/app/lib/models/cashflow/CashFlowEntry";
import { CashFlowType } from "@/app/lib/models/cashflow/CashFlowType";
import { getCashFlowValidationResult } from "./getCashFlowValidationResult";
import { convertDollarsToCents } from "../../../CashFlowUtils";

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
    let errorMessage = "An unexpected validation error occurred.";
    if (error && typeof error === "object" && "message" in error) {
      errorMessage += `\n${(error as { message: string }).message}`;
    }
    return { entry: null, errors: [errorMessage] };
  }
};