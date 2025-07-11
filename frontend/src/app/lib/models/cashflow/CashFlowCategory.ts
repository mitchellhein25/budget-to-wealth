import { Category } from "../Category";
import { CashFlowType } from "./CashFlowType";

export type CashFlowCategory = Category & {
    categoryType: CashFlowType;
}