import { Holding } from "@/app/net-worth/holding-snapshots/holdings";

export const convertHoldingToFormData = (holding: Holding) => ({
  id: holding.id?.toString(),
  name: holding.name,
  type: holding.type,
  holdingCategoryId: holding.holdingCategoryId,
  institution: holding.institution
});