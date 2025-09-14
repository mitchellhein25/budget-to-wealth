export const CashFlowType = {
  INCOME: "Income",
  EXPENSE: "Expense",
} as const;

export type CashFlowType = typeof CashFlowType[keyof typeof CashFlowType];
