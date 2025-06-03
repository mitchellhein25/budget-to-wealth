export interface CashFlowEntry {
    id?: number;
    amount: number;
    entryType: CashFlowType;
    categoryId: string;
    date: string;
    description?: string;
    userId?: string;
    recurrenceFrequency?: RecurrenceFrequency;
    recurrenceEndDate?: string;
}