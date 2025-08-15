import { ListTableItem } from "@/app/components/table/ListTable";
import { Category } from "@/app/components/categories/Category";
import { HoldingType } from ".";

export type Holding = ListTableItem & {
  id?: number;
  name: string;
  type: HoldingType;
  holdingCategoryId: string;
  holdingCategory?: Category;
  institution?: string;
}
