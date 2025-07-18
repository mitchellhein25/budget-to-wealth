import { Category } from "../../components/categories/Category";
import { CashFlowType } from "./CashFlowType";

export type CashFlowCategory = Category & {
    categoryType: CashFlowType;
}