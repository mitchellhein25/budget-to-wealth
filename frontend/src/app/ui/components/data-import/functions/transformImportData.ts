import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import { HoldingType } from '@/app/lib/models/net-worth/HoldingType';
import { BudgetImport, CashFlowCategoryImport, CashFlowEntryImport, HoldingCategoryImport, HoldingImport, HoldingSnapshotImport, ImportDataType, ImportDataTypeStringMappings, ImportDataTypeStrings } from '../DataImportTypes';
import { cleanCurrencyInput, convertDollarsToCents } from '../../Utils';
import { HoldingSnapshot } from '@/app/lib/models/net-worth/HoldingSnapshot';
import { RecurrenceFrequency } from '@/app/lib/models/cashflow/RecurrenceFrequency';

export function transformImportData(data: ImportDataType[], dataType: ImportDataTypeStrings): any[] { 
  switch (dataType) {
    case ImportDataTypeStringMappings.CashFlowEntries:
      return data.map((item: any) => ({
        amount: convertDollarsToCents(cleanCurrencyInput(item.amount.toString()) || '0'),
        date: item.date,
        categoryName: item.categoryName,
        description: item.description,
        entryType: item.entryType,
        recurrenceFrequency: item.recurrenceFrequency,
      } as CashFlowEntryImport));

    case ImportDataTypeStringMappings.Holdings:
      return data.map((item: any) => ({
        name: item.name,
        type: item.type,
        holdingCategoryName: item.holdingCategoryName
      } as HoldingImport));

    case ImportDataTypeStringMappings.HoldingSnapshots:
      return data.map((item: any) => ({
        holdingName: item.holdingName,
        balance: convertDollarsToCents(cleanCurrencyInput(item.balance.toString()) || '0'),
        date: item.date
      } as HoldingSnapshotImport));

    case ImportDataTypeStringMappings.Budgets:
      return data.map((item: any) => ({
        amount: convertDollarsToCents(cleanCurrencyInput(item.amount.toString()) || '0'),
        categoryName: item.categoryName,
        name: item.name
      } as BudgetImport));

    case ImportDataTypeStringMappings.HoldingCategories:
      return data.map((item: any) => ({
        name: item.name
      } as HoldingCategoryImport));

    case ImportDataTypeStringMappings.CashFlowCategories:
      return data.map((item: any) => ({
        name: item.name,
        type: item.type
      } as CashFlowCategoryImport));

    default:
      return data;
  }
} 