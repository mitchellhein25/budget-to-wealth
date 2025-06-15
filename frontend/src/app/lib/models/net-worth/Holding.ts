import { HoldingCategory } from "./HoldingCategory";
import { HoldingType } from "./HoldingType";

export type Holding = {
  id?: number;
  name: string;
  type: HoldingType;
  holdingCategoryId: string;
  holdingCategory?: HoldingCategory;
}
