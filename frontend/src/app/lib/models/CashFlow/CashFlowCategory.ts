import { CashFlowType } from "./CashFlowType";

export interface CashFlowCategory {
    id?: number;
    name: string;
    categoryType: CashFlowType;
    userId?: string;
}