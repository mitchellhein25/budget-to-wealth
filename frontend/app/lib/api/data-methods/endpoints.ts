export const BUDGETS_ENDPOINT = "Budgets";
export const CASH_FLOW_ENTRIES_ENDPOINT = "CashFlowEntries";
export const CASH_FLOW_CATEGORIES_ENDPOINT = "CashFlowCategories";
export const HOLDING_SNAPSHOTS_ENDPOINT = "HoldingSnapshots";
export const HOLDINGS_ENDPOINT = "Holdings";
export const HOLDING_CATEGORIES_ENDPOINT = "HoldingCategories";
export const MANUAL_INVESTMENT_CATEGORIES_ENDPOINT = "ManualInvestmentCategories";
export const INVESTMENT_RETURNS_ENDPOINT = "InvestmentReturns";
export const CASH_FLOW_TREND_GRAPH_ENDPOINT = "CashFlowTrendGraph";
export const NET_WORTH_TREND_GRAPH_ENDPOINT = "NetWorthTrendGraph";
export const AVAILABLE_DATE_RANGE_ENDPOINT = "AvailableDateRange";
export const CASH_FLOW_ENTRIES_AVAILABLE_DATE_RANGE_ENDPOINT = `${CASH_FLOW_ENTRIES_ENDPOINT}/${AVAILABLE_DATE_RANGE_ENDPOINT}`;
export const HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT = `${HOLDING_SNAPSHOTS_ENDPOINT}/${AVAILABLE_DATE_RANGE_ENDPOINT}`;

export type DateRangeResponse = { startDate?: string; endDate?: string };