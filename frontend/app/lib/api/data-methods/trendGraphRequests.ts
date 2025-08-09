import { DateRange } from "@/app/components";
import { CASH_FLOW_TREND_GRAPH_ENDPOINT, getQueryStringForDateRange, NET_WORTH_TREND_GRAPH_ENDPOINT } from ".";
import { getRequestSingle } from "../rest-methods";
import { DateRangeResponse } from "./holdingSnapshotRequests";

export async function getCashFlowTrendGraphDateRange(dateRange: DateRange) {
  return await getRequestSingle<DateRangeResponse>(`${CASH_FLOW_TREND_GRAPH_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`)
}

export async function getNetWorthTrendGraphDateRange(dateRange: DateRange) {
  return await getRequestSingle<DateRangeResponse>(`${NET_WORTH_TREND_GRAPH_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`)
}