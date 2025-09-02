"use server";

import { DateRange } from "@/app/components";
import { Budget } from "@/app/cashflow/budget/components";
import { BUDGETS_ENDPOINT, deleteRequest, getQueryStringForDateRange, getRequestList } from "..";

export async function getBudgetsByDateRange(dateRange: DateRange) {
  const fetchEndpoint = `${BUDGETS_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`;
  const response = await getRequestList<Budget>(fetchEndpoint);
  if (response.successful) {
    const budgets = response.data as Budget[];
    budgets.forEach(budget => budget.name = budget.category?.name ?? "");
    response.data = budgets;
  }
  return response;
}

export async function deleteBudget(id: number) {
  return await deleteRequest<Budget>(BUDGETS_ENDPOINT, id);
}
