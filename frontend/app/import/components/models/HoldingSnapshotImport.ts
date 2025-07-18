export type HoldingSnapshotImport = {
  holdingName: string;
  date: string;
  balanceInCents: number;
  holdingCategoryName: string;
  holdingType: "Asset" | "Debt";
  holdingInstitution?: string;
} 