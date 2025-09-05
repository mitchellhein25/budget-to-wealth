import { Category, ListTableItem } from "@/app/components";
import { HoldingType } from "@/app/net-worth/holding-snapshots/holdings";

export type Holding = ListTableItem & {
  id?: number;
  name: string;
  type: HoldingType;
  holdingCategoryId: string;
  holdingCategory?: Category;
  institution?: string;
}
