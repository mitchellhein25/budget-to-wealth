import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import { HoldingType } from '@/app/lib/models/net-worth/HoldingType';
import { BudgetImport } from '../../../../lib/models/data-import/BudgetImport';
import { CashFlowCategoryImport } from '../../../../lib/models/data-import/CashFlowCategoryImport';
import { CashFlowEntryImport } from '../../../../lib/models/data-import/CashFlowEntryImport';
import { HoldingCategoryImport } from '../../../../lib/models/data-import/HoldingCategoryImport';
import { HoldingImport } from '../../../../lib/models/data-import/HoldingImport';
import { HoldingSnapshotImport } from '../../../../lib/models/data-import/HoldingSnapshotImport';
import { ImportDataType } from '../../../../lib/models/data-import/ImportDataType';
import { ImportDataTypeStringMappings } from '../../../../lib/models/data-import/ImportDataTypeStringMappings';
import { ImportDataTypeStrings } from '../../../../lib/models/data-import/ImportDataTypeStrings';
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
        categoryType: item.categoryType,
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
        date: item.date,
        holdingCategory: item.holdingCategory,
        holdingType: item.holdingType
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
        categoryType: item.categoryType
      } as CashFlowCategoryImport));

    default:
      return data;
  }
} 