"use server";

import { DateRange } from "@/app/components";
import { CashFlowEntry, CashFlowType } from "@/app/cashflow/components";
import { deleteRequest, getQueryStringForDateRange, getRequestList, getRequestSingle, CASH_FLOW_ENTRIES_AVAILABLE_DATE_RANGE_ENDPOINT, CASH_FLOW_ENTRIES_ENDPOINT, CASH_FLOW_ENTRIES_RECURRING_ENDPOINT, DateRangeResponse } from "..";

export async function getCashFlowEntriesByDateRangeAndType(dateRange: DateRange, cashFlowType: CashFlowType) {
  const fetchEndpoint = `${CASH_FLOW_ENTRIES_ENDPOINT}?entryType=${cashFlowType}&${getQueryStringForDateRange(dateRange)}`;
  return await getRequestList<CashFlowEntry>(fetchEndpoint);
}

export async function deleteCashFlowEntry(id: number) {
  return await deleteRequest<CashFlowEntry>(CASH_FLOW_ENTRIES_ENDPOINT, id);
}

export async function getCashFlowEntriesDateRange() {
  return await getRequestSingle<DateRangeResponse>(CASH_FLOW_ENTRIES_AVAILABLE_DATE_RANGE_ENDPOINT);
}

export async function getRecurringCashFlowEntries(cashFlowType: CashFlowType | null = null) {
  let fetchEndpoint = `${CASH_FLOW_ENTRIES_RECURRING_ENDPOINT}?activeOnly=true`;
  if (cashFlowType) {
    fetchEndpoint += `&entryType=${cashFlowType}`;
  }
  return await getRequestList<CashFlowEntry>(fetchEndpoint);
}
