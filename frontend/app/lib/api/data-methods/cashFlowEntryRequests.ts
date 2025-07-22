"use server";

import { DateRange } from "@/app/components";
import { CashFlowEntry, CashFlowType } from "@/app/cashflow/components";
import { getQueryStringForDateRange } from "./queryHelpers";
import { CASH_FLOW_ENTRIES_ENDPOINT } from "./endpoints";
import { deleteRequest, getRequestList } from "@/app/lib/api/rest-methods";

export async function getCashFlowEntriesByDateRangeAndType(dateRange: DateRange, cashFlowType: CashFlowType) {
  const fetchEndpoint = `${CASH_FLOW_ENTRIES_ENDPOINT}?entryType=${cashFlowType}&${getQueryStringForDateRange(dateRange)}`;
  return await getRequestList<CashFlowEntry>(fetchEndpoint);
}

export async function deleteCashFlowEntry(id: number) {
  return await deleteRequest<CashFlowEntry>(CASH_FLOW_ENTRIES_ENDPOINT, id);
}
