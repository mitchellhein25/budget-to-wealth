import { Budget } from "../Budget";

export const convertBudgetToFormData = (budget: Budget) => ({
  id: budget.id?.toString(),
  amount: (budget.amount / 100).toFixed(2),
  categoryId: budget.categoryId,
});