import { CashFlowEntry } from "@/app/cashflow";

export const convertCashFlowEntryToFormData = (cashFlowEntry: CashFlowEntry) => {
  return {
    id: cashFlowEntry.id?.toString(),
    amount: (cashFlowEntry.amount / 100).toFixed(2),
    date: new Date(cashFlowEntry.date),
    categoryId: cashFlowEntry.categoryId,
    description: cashFlowEntry.description ?? "",
    recurrenceFrequency: cashFlowEntry.recurrenceFrequency,
    recurrenceEndDate: cashFlowEntry.recurrenceEndDate,
  }
};