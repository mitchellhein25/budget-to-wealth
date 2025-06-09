import { CashFlowCategory } from "./CashFlowCategory";
import { CashFlowType } from "./CashFlowType";
import { RecurrenceFrequency } from "./RecurrenceFrequency";

export type CashFlowEntry = {
    id?: number;
    amount: number;
    entryType: CashFlowType;
    categoryId: string;
    category?: CashFlowCategory;
    date: string;
    description?: string;
    userId?: string;
    recurrenceFrequency?: RecurrenceFrequency;
    recurrenceEndDate?: string;
};