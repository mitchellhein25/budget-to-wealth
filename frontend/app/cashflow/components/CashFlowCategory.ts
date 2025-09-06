import { Category } from "@/app/components";
import { CashFlowType } from "@/app/cashflow";

export type CashFlowCategory = Category & {
    categoryType: CashFlowType;
}