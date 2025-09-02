import { DateRange } from "@/app/components";
import { CashFlowTrendGraphData } from "@/app/dashboards/cashflow/components";
import { NetWorthTrendGraphData } from "@/app/dashboards/net-worth/components";
import { getRequestSingle, CASH_FLOW_TREND_GRAPH_ENDPOINT, getQueryStringForDateRange, NET_WORTH_TREND_GRAPH_ENDPOINT } from "..";

export async function getCashFlowTrendGraphForDateRange(dateRange: DateRange) {
  return await getRequestSingle<CashFlowTrendGraphData>(`${CASH_FLOW_TREND_GRAPH_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`)
}

export async function getNetWorthTrendGraphForDateRange(dateRange: DateRange) {
  return await getRequestSingle<NetWorthTrendGraphData>(`${NET_WORTH_TREND_GRAPH_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`)
}