import { TrendGraphData, TrendGraphEntry } from '@/app/dashboards';

export type CashFlowTrendGraphData = TrendGraphData<CashFlowTrendGraphEntry>;

export type CashFlowTrendGraphEntry = TrendGraphEntry & {
    incomeInCents: number;
    expensesInCents: number;
    netCashFlowInCents: number;
}