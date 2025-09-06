import { TrendGraphData, TrendGraphEntry } from '@/app/dashboards';

export type NetWorthTrendGraphData = TrendGraphData<NetWorthTrendGraphEntry>;

export type NetWorthTrendGraphEntry = TrendGraphEntry & {
    assetValueInCents: number;
    debtValueInCents: number;
    netWorthInCents: number;
}