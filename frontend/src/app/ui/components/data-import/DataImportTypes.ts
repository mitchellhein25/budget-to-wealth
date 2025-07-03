import { Budget } from "@/app/lib/models/cashflow/Budget";
import { CashFlowCategory } from "@/app/lib/models/cashflow/CashFlowCategory";
import { CashFlowEntry } from "@/app/lib/models/cashflow/CashFlowEntry";
import { Holding } from "@/app/lib/models/net-worth/Holding";
import { HoldingSnapshot } from "@/app/lib/models/net-worth/HoldingSnapshot";
import { Category } from "@/app/lib/models/Category";
import { CashFlowType } from "@/app/lib/models/cashflow/CashFlowType";
import { RecurrenceFrequency } from "@/app/lib/models/cashflow/RecurrenceFrequency";
import { HoldingType } from "@/app/lib/models/net-worth/HoldingType";

export type ImportDataType = CashFlowEntryImport | HoldingSnapshotImport | HoldingImport | BudgetImport | HoldingCategoryImport | CashFlowCategoryImport;

export const ImportDataTypeStringMappings = {
    CashFlowEntries: "CashFlow Entries",
  HoldingSnapshots: "Holding Snapshots",
  Holdings: "Holdings",
  Budgets: "Budgets",
  HoldingCategories: "Holding Categories",
  CashFlowCategories: "Cash Flow Categories"
} as const;

export type ImportDataTypeStrings = (typeof ImportDataTypeStringMappings)[keyof typeof ImportDataTypeStringMappings];

export type CashFlowEntryImport = {
  amount: number;
  date: string;
  categoryType: "Income" | "Expense";
  categoryName: string;
  description: string;
  recurrenceFrequency: "Daily" | "Weekly" | "Monthly" | "Yearly";
}

export type HoldingSnapshotImport = {
  holdingName: string;
  date: string;
  balance: number;
  holdingCategory: string;
  holdingType: "Asset" | "Debt";
}

export type HoldingImport = {
  name: string;
  type: "Asset" | "Debt";
  holdingCategoryName: string;
}

export type BudgetImport = {
  amount: number;
  categoryName: string;
  name: string;
}

export type HoldingCategoryImport = {
  name: string;
}

export type CashFlowCategoryImport = {
  name: string;
  categoryType: "Income" | "Expense";
}

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

export interface DataImportProps {
  dataType: ImportDataTypeStrings;
  onImportComplete?: (result: ImportResult) => void;
  onCancel?: () => void;
  className?: string;
}