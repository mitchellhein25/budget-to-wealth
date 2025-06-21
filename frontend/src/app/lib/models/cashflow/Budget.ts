import { ListTableItem } from "@/app/ui/components/table/ListTable";
import { CashFlowCategory } from "./CashFlowCategory";

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