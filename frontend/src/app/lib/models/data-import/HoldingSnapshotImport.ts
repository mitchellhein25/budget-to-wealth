export type HoldingSnapshotImport = {
  holdingName: string;
  date: string;
  balance: number;
  holdingCategory: string;
  holdingType: "Asset" | "Debt";
} 