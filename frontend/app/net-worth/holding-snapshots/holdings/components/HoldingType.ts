export const HoldingType = {
  ASSET: "Asset",
  DEBT: "Debt"
}
export type HoldingType = typeof HoldingType[keyof typeof HoldingType];