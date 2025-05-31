enum CashFlowType {
  Income = 'Income',
  Expense = 'Expense'
}

enum RecurrenceFrequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

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