import { ListTableItem } from "@/app/components/table/ListTable";
import { HoldingType } from "./HoldingType";
import { Category } from "../../components/categories/Category";

export type Holding = ListTableItem & {
  id?: number;
  name: string;
  type: HoldingType;
  holdingCategoryId: string;
  holdingCategory?: Category;
  institution?: string;
}
