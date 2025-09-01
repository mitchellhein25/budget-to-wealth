import { Category } from "@/app/components/categories";
import { CashFlowType } from "./CashFlowType";

export type CashFlowCategory = Category & {
    categoryType: CashFlowType;
}