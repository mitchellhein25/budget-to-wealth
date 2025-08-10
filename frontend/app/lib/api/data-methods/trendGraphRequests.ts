import { DateRange } from "@/app/components";
import { CASH_FLOW_TREND_GRAPH_ENDPOINT, getQueryStringForDateRange, NET_WORTH_TREND_GRAPH_ENDPOINT } from ".";
import { getRequestSingle } from "../rest-methods";
import { CashFlowTrendGraphData } from "@/app/dashboards/cashflow/components/CashFlowTrendGraphData";
import { NetWorthTrendGraphData } from "@/app/dashboards/net-worth/components/NetWorthTrendGraphData";

export async function getCashFlowTrendGraphForDateRange(dateRange: DateRange) {
  return await getRequestSingle<CashFlowTrendGraphData>(`${CASH_FLOW_TREND_GRAPH_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`)
}

export async function getNetWorthTrendGraphForDateRange(dateRange: DateRange) {
  return await getRequestSingle<NetWorthTrendGraphData>(`${NET_WORTH_TREND_GRAPH_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`)
}