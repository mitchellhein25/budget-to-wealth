import { getRequestList } from "../rest-methods/getRequest";
import { DateRange } from "@/app/components/DatePicker";
import { Budget } from "@/app/cashflow/budget/components/Budget";
import { getQueryStringForDateRange } from "./queryHelpers";

export async function getBudgetsByDateRange(dateRange: DateRange) {
  const fetchEndpoint = `Budgets?${getQueryStringForDateRange(dateRange)}`;
  const response = await getRequestList<Budget>(fetchEndpoint);
  if (response.successful) {
    const budgets = response.data as Budget[];
    budgets.forEach(budget => budget.name = budget.category?.name ?? "");
    response.data = budgets;
  }
  return response;
}