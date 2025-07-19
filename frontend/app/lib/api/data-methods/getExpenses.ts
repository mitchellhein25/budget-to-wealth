import { getRequestList } from "../rest-methods/getRequest";
import { DateRange } from "@/app/components/DatePicker";
import { CashFlowEntry } from "@/app/cashflow/components/CashFlowEntry";
import { CashFlowType } from "@/app/cashflow/components/CashFlowType";
import { getQueryStringForDateRange } from "./queryHelpers";

export async function getExpensesByDateRange(dateRange: DateRange) {
  const fetchEndpoint = `CashFlowEntries?entryType=${CashFlowType.Expense}&${getQueryStringForDateRange(dateRange)}`;
  return await getRequestList<CashFlowEntry>(fetchEndpoint);
}