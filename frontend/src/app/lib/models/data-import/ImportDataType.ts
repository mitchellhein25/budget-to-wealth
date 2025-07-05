import { CashFlowEntryImport } from './CashFlowEntryImport';
import { CashFlowCategoryImport } from './CashFlowCategoryImport';
import { BudgetImport } from './BudgetImport';
import { HoldingSnapshotImport } from './HoldingSnapshotImport';
import { HoldingImport } from './HoldingImport';
import { HoldingCategoryImport } from './HoldingCategoryImport';

export type ImportDataType = CashFlowEntryImport | HoldingSnapshotImport | HoldingImport | BudgetImport | HoldingCategoryImport | CashFlowCategoryImport; 