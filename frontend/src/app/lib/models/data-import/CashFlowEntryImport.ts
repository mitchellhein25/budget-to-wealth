export type CashFlowEntryImport = {
  amountInCents: number;
  date: string;
  categoryName: string;
  categoryType: "Income" | "Expense";
  description?: string;
  recurrenceFrequency?: "Daily" | "Weekly" | "Monthly" | "Yearly";
} 