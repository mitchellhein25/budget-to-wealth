import { convertDollarsToCents } from "@/app/lib/utils";
import { Budget, BUDGET_ITEM_NAME_LOWERCASE, budgetFormSchema } from "@/app/cashflow/budget";

export const transformFormDataToBudget = (formData: FormData): { item: Budget | null; errors: string[] } => {
  try {
    const rawData = {
      amount: formData.get(`${BUDGET_ITEM_NAME_LOWERCASE}-amount`) as string || "",
      categoryId: formData.get(`${BUDGET_ITEM_NAME_LOWERCASE}-categoryId`) as string || ""
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
      amount: amountInCents,
      categoryId: validatedData.categoryId,
      name: '',
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
