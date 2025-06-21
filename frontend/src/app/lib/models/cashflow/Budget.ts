import { CashFlowCategory } from "./CashFlowCategory";

export type Budget = {
  id?: number;
  amount: number;
  categoryId: string;
  category?: CashFlowCategory;
  startDate?: string;
  endDate?: string;
  userId?: string;
}