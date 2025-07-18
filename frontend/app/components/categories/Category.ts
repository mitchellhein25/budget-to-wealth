import { ListTableItem } from "@/app/components/table/ListTable";

export type Category = ListTableItem & {
  id?: number;
  name: string;
  userId?: string;
};