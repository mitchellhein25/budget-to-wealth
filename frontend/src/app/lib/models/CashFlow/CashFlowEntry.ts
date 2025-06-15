import { CashFlowCategory } from "./CashFlowCategory";
import { CashFlowType } from "./CashFlowType";
import { RecurrenceFrequency } from "./RecurrenceFrequency";
import { ListTableItem } from "@/app/ui/components/table/ListTable";

export type CashFlowEntry = ListTableItem & {
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