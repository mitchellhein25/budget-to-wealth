import { ListTableItem } from "@/app/components";
import { CashFlowCategory, CashFlowType, RecurrenceFrequency } from "@/app/cashflow";


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

export const getRecurrenceText = (entry: CashFlowEntry) => {
    if (!entry.recurrenceFrequency) {
        return '';
    }
    
    let text = entry.recurrenceFrequency === RecurrenceFrequency.EVERY_2_WEEKS ? 'Every 2 Weeks' : entry.recurrenceFrequency.toString();
    if (entry.recurrenceEndDate) {
        text += ` until ${new Date(entry.recurrenceEndDate).toLocaleDateString()}`;
    }
    
    return text;
};