export type NetWorthTrendGraphData = {
    entries: NetWorthTrendGraphEntry[];
}

export type NetWorthTrendGraphEntry = {
    date: string;
    assetValueInCents: number;
    debtValueInCents: number;
    netWorthInCents: number;
}