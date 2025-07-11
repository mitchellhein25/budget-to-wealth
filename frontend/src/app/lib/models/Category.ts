import { ListTableItem } from "@/app/ui/components/table/ListTable";

export type Category = ListTableItem & {
  id?: number;
  name: string;
  userId?: string;
};