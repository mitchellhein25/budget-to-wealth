export type CashFlowTrendGraphData = {
    entries: CashFlowTrendGraphEntry[];
}

export type CashFlowTrendGraphEntry = {
    date: string;
    incomeInCents: number;
    expensesInCents: number;
    netCashFlowInCents: number;
}