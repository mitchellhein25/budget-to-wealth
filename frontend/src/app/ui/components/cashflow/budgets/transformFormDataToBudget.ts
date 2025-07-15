import { convertDollarsToCents } from "../../Utils";
import { Budget } from "@/app/lib/models/cashflow/Budget";
import { budgetFormSchema } from "./BudgetFormData";

export const transformFormDataToBudget = (formData: FormData): { item: Budget | null; errors: string[] } => {
  try {
    const rawData = {
      id: formData.get(`budget-id`) as string || undefined,
      amount: formData.get(`budget-amount`) as string,
      categoryId: formData.get(`budget-categoryId`) as string || ""
    };

    const validationResult =  budgetFormSchema.safeParse(rawData);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: { message: string }) => err.message);
      return { item: null, errors: [errors[0]] };
    }

    const validatedData = validationResult.data;
    const amountInCents = convertDollarsToCents(validatedData.amount);

    if (amountInCents === null) {
      return { item: null, errors: ["Invalid amount format"] };
    }

    const item: Budget = {
      id: validatedData.id ? parseInt(validatedData.id) : 0,
      amount: amountInCents,
      categoryId: validatedData.categoryId,
      name: "",
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
