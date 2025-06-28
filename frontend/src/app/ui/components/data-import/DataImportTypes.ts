import { Budget } from "@/app/lib/models/cashflow/Budget";
import { CashFlowCategory } from "@/app/lib/models/cashflow/CashFlowCategory";
import { CashFlowEntry } from "@/app/lib/models/cashflow/CashFlowEntry";
import { Holding } from "@/app/lib/models/net-worth/Holding";
import { HoldingSnapshot } from "@/app/lib/models/net-worth/HoldingSnapshot";
import { Category } from "@/app/lib/models/Category";

export type ImportDataType = CashFlowEntry | HoldingSnapshot | Holding | Budget | Category;

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
  dataType: ImportDataType;
  onImportComplete?: (result: ImportResult) => void;
  onCancel?: () => void;
  className?: string;
}