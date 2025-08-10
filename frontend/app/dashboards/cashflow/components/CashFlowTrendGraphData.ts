import { TrendGraphData, TrendGraphEntry } from "../../components";

export type CashFlowTrendGraphData = TrendGraphData<CashFlowTrendGraphEntry>;

export type CashFlowTrendGraphEntry = TrendGraphEntry & {
    incomeInCents: number;
    expensesInCents: number;
    netCashFlowInCents: number;
}