export type NetWorthDashboardData = {
    entries: NetWorthDashboardEntry[];
}

export type NetWorthDashboardEntry = {
    date: string;
    assetValueInCents: number;
    debtValueInCents: number;
    netWorthInCents: number;
}