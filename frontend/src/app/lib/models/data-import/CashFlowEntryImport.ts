export type CashFlowEntryImport = {
  amount: number;
  date: string;
  categoryType: "Income" | "Expense";
  categoryName: string;
  description: string;
  recurrenceFrequency: "Daily" | "Weekly" | "Monthly" | "Yearly";
} 