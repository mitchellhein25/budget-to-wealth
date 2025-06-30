export interface ImportError {
  row: number;
  message: string;
  field?: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errorCount: number;
  errors: ImportError[];
}

export interface CashFlowEntryImport {
  amount: string;
  date: string;
  categoryName: string;
  description?: string;
  entryType: 'Income' | 'Expense';
}

export interface HoldingImport {
  name: string;
  type: 'Asset' | 'Debt';
  categoryName: string;
}

export interface HoldingSnapshotImport {
  holdingName: string;
  value: string;
  date: string;
}

export interface BudgetImport {
  amount: string;
  categoryName: string;
} 