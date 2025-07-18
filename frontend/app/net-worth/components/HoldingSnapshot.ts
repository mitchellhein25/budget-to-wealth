import { ListTableItem } from "@/app/components/table/ListTable";
import { Holding } from "./Holding";

export type HoldingSnapshot = ListTableItem & {
  id?: number;
  holdingId: string;
  holding?: Holding;
  date: string;
  balance: number;
  userId?: string;
}
