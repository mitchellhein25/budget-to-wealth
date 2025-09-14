import { CashFlowEntryImport } from './CashFlowEntryImport';
import { CashFlowCategoryImport } from './CashFlowCategoryImport';
import { BudgetImport } from './BudgetImport';
import { HoldingSnapshotImport } from './HoldingSnapshotImport';
import { HoldingImport } from './HoldingImport';
import { HoldingCategoryImport } from './HoldingCategoryImport';

export type ImportDataType = CashFlowEntryImport | HoldingSnapshotImport | HoldingImport | BudgetImport | HoldingCategoryImport | CashFlowCategoryImport; 

export const ImportDataTypeString = {
  CashFlowEntries: "CashFlow Entries",
  HoldingSnapshots: "Holding Snapshots",
  Holdings: "Holdings",
  Budgets: "Budgets",
  HoldingCategories: "Holding Categories",
  CashFlowCategories: "Cash Flow Categories"
} as const; 

export type ImportDataTypeString = (typeof ImportDataTypeString)[keyof typeof ImportDataTypeString]; 