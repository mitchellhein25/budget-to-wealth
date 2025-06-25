export type TrendGraphData = {
    entries: TrendGraphEntry[];
}

export type TrendGraphEntry = {
    date: string;
    positiveValue: number;
    negativeValue: number;
    netValue: number;
}