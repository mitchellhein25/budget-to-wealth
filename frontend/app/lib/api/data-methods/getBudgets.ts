import { formatDate } from "@/app/components/Utils";
import { getRequestList } from "../rest-methods/getRequest";
import { DateRange } from "@/app/components/DatePicker";
import { Budget } from "@/app/cashflow/budget/components/Budget";

export async function getBudgetsByDateRange(dateRange: DateRange) {
  const fetchEndpoint = `Budgets?startDate=${formatDate(dateRange.from)}&endDate=${formatDate(dateRange.to)}`;
  return await getRequestList<Budget>(fetchEndpoint);
}