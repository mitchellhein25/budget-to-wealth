import { DateRange } from "@/app/components";
import { CashFlowTrendGraphData } from "@/app/dashboards/cashflow";
import { NetWorthTrendGraphData } from "@/app/dashboards/net-worth";
import { getRequestSingle, CASH_FLOW_TREND_GRAPH_ENDPOINT, getQueryStringForDateRange, NET_WORTH_TREND_GRAPH_ENDPOINT } from "@/app/lib/api";

export async function getCashFlowTrendGraphForDateRange(dateRange: DateRange) {
  return await getRequestSingle<CashFlowTrendGraphData>(`${CASH_FLOW_TREND_GRAPH_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`)
}

export async function getNetWorthTrendGraphForDateRange(dateRange: DateRange) {
  return await getRequestSingle<NetWorthTrendGraphData>(`${NET_WORTH_TREND_GRAPH_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`)
}