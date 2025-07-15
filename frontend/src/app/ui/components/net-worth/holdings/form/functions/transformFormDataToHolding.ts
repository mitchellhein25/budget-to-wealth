import { getHoldingValidationResult } from "./getHoldingValidationResult";
import { Holding } from "@/app/lib/models/net-worth/Holding";
import { HoldingType } from "@/app/lib/models/net-worth/HoldingType";

export const transformFormDataToHolding = (formData: FormData): { item: Holding | null; errors: string[] } => {
  try {
    const validationResult = getHoldingValidationResult(formData);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message);
      return { item: null, errors: [errors[0]] };
    }

    const validatedData = validationResult.data;

    const item: Holding = {
      id: validatedData.id ? parseInt(validatedData.id) : 0,
      name: validatedData.name,
      type: validatedData.type as HoldingType,
      holdingCategoryId: validatedData.holdingCategoryId as string,
      institution: validatedData.institution
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
