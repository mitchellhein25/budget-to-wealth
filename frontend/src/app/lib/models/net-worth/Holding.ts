import { ListTableItem } from "@/app/ui/components/table/ListTable";
import { HoldingCategory } from "./HoldingCategory";
import { HoldingType } from "./HoldingType";

export type Holding = ListTableItem & {
  id?: number;
  name: string;
  type: HoldingType;
  holdingCategoryId: string;
  holdingCategory?: HoldingCategory;
}
