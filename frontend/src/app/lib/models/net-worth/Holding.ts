import { ListTableItem } from "@/app/ui/components/table/ListTable";
import { HoldingType } from "./HoldingType";
import { Category } from "../Category";

export type Holding = ListTableItem & {
  id?: number;
  name: string;
  type: HoldingType;
  holdingCategoryId: string;
  holdingCategory?: Category;
  institution?: string;
}
