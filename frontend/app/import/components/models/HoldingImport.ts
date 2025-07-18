export type HoldingImport = {
  name: string;
  type: "Asset" | "Debt";
  holdingCategoryName: string;
  institution?: string;
} 