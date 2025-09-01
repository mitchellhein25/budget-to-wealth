import { Holding } from "../..";

export const convertHoldingToFormData = (holding: Holding) => ({
  id: holding.id?.toString(),
  name: holding.name,
  type: holding.type,
  holdingCategoryId: holding.holdingCategoryId,
  institution: holding.institution
});