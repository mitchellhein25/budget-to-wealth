"use server";

import { getRequestList } from "../rest-methods/getRequest";
import { DateRange } from "@/app/components/DatePicker";
import { CashFlowEntry } from "@/app/cashflow/components/CashFlowEntry";
import { CashFlowType } from "@/app/cashflow/components/CashFlowType";
import { getQueryStringForDateRange } from "./queryHelpers";
import { CASH_FLOW_ENTRIES_ENDPOINT } from "./endpoints";

export async function getCashFlowEntriesByDateRangeAndType(dateRange: DateRange, cashFlowType: CashFlowType) {
  const fetchEndpoint = `${CASH_FLOW_ENTRIES_ENDPOINT}?entryType=${cashFlowType}&${getQueryStringForDateRange(dateRange)}`;
  return await getRequestList<CashFlowEntry>(fetchEndpoint);
}