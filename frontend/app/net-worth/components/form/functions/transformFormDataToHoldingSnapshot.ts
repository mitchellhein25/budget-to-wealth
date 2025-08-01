import { getHoldingSnapshotValidationResult } from "./getHoldingSnapshotValidationResult";
import { convertDollarsToCents } from "../../../../components/Utils";
import { HoldingSnapshot } from "../..";

export const transformFormDataToHoldingSnapshot = (formData: FormData): { item: HoldingSnapshot | null; errors: string[] } => {
  try {
    const validationResult = getHoldingSnapshotValidationResult(formData);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message);
      return { item: null, errors: [errors[0]] };
    }

    const validatedData = validationResult.data;
    const balanceInCents = convertDollarsToCents(validatedData.balance);

    if (balanceInCents === null) {
      return { item: null, errors: ["Invalid balance format"] };
    }

    const item: HoldingSnapshot = {
      holdingId: validatedData.holdingId as string,
      date: validatedData.date.toISOString().split('T')[0],
      balance: balanceInCents,
    };

    return { item, errors: [] };
  } catch (error) {
    let errorMessage = "An unexpected validation error occurred.";
    if (error && typeof error === "object" && "message" in error) {
      errorMessage += `\n${(error as { message: string }).message}`;
    }
    return { item: null, errors: [errorMessage] };
  }
};
