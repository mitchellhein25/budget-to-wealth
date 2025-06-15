import { Category } from "../Category";
import { CashFlowType } from "./CashFlowType";

export interface CashFlowCategory extends Category {
    categoryType: CashFlowType;
}