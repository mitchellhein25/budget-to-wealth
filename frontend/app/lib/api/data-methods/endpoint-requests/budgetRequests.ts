"use server";

import { DateRange } from "@/app/components";
import { Budget } from "@/app/cashflow/budget";
import { archivePutRequest, BUDGETS_ENDPOINT, getQueryStringForDateRange, getRequestList } from "@/app/lib/api";

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

export async function archiveBudget(id: number) {
  return await archivePutRequest<Budget>(BUDGETS_ENDPOINT, id);
}
