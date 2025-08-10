import { TrendGraphData, TrendGraphEntry } from "../../components";

export type NetWorthTrendGraphData = TrendGraphData<NetWorthTrendGraphEntry>;

export type NetWorthTrendGraphEntry = TrendGraphEntry & {
    assetValueInCents: number;
    debtValueInCents: number;
    netWorthInCents: number;
}