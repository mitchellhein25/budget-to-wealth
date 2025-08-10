export type TrendGraphData<T extends TrendGraphEntry> = {
  entries: T[];
}

export type TrendGraphEntry = {
  date: string;
}