import { ListTableItem } from "@/app/components/table/ListTable";
import { CashFlowCategory } from "../../components";

export type Budget = ListTableItem & {
  id?: number;
  amount: number;
  categoryId: string;
  category?: CashFlowCategory;
  name?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
}