import { ImportDataType, CashFlowEntryImport, HoldingImport, HoldingSnapshotImport, BudgetImport } from '../ExcelImportTypes';
import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import { HoldingType } from '@/app/lib/models/net-worth/HoldingType';

export function transformImportData(data: any[], dataType: ImportDataType): any[] {
  switch (dataType) {
    case 'CashFlowEntry':
      return data.map((item: CashFlowEntryImport) => ({
        amount: Math.round(parseFloat(item.amount) * 100), // Convert to cents
        date: item.date,
        categoryName: item.categoryName,
        description: item.description,
        entryType: item.entryType === 'Income' ? CashFlowType.Income : CashFlowType.Expense
      }));

    case 'Holding':
      return data.map((item: HoldingImport) => ({
        name: item.name,
        type: item.type === 'Asset' ? HoldingType.Asset : HoldingType.Debt,
        categoryName: item.categoryName
      }));

    case 'HoldingSnapshot':
      return data.map((item: HoldingSnapshotImport) => ({
        holdingName: item.holdingName,
        value: Math.round(parseFloat(item.value) * 100), // Convert to cents
        date: item.date
      }));

    case 'Budget':
      return data.map((item: BudgetImport) => ({
        amount: Math.round(parseFloat(item.amount) * 100), // Convert to cents
        categoryName: item.categoryName
      }));

    default:
      return data;
  }
} 