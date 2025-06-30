import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import { HoldingType } from '@/app/lib/models/net-worth/HoldingType';
import { CashFlowEntryImport, ImportDataTypeStringMappings, ImportDataTypeStrings } from '../DataImportTypes';
import { cleanCurrencyInput, convertDollarsToCents } from '../../Utils';
import { HoldingSnapshot } from '@/app/lib/models/net-worth/HoldingSnapshot';
import { RecurrenceFrequency } from '@/app/lib/models/cashflow/RecurrenceFrequency';

export function transformImportData(data: any[], dataType: ImportDataTypeStrings): any[] { 
  switch (dataType) {
    case ImportDataTypeStringMappings.CashFlowEntries:
      return data.map((item: any) => ({
        amount: convertDollarsToCents(cleanCurrencyInput(item.amount) || '0'),
        date: item.date,
        categoryName: item.categoryName,
        description: item.description,
        entryType: item.entryType.toLowerCase() === 'income' ? CashFlowType.Income : CashFlowType.Expense,
        recurrenceFrequency: item.recurrenceFrequency.toLowerCase() === 'monthly' ? RecurrenceFrequency.Monthly : RecurrenceFrequency.Yearly,
      } as CashFlowEntryImport));

    case ImportDataTypeStringMappings.Holdings:
      return data.map((item: any) => ({
        name: item.name,
        type: item.type.toLowerCase() === 'asset' ? HoldingType.Asset : HoldingType.Debt,
        categoryName: item.categoryName
      }));

    case ImportDataTypeStringMappings.HoldingSnapshots:
      return data.map((item: any) => ({
        holding: item.holdingId,
        balance: convertDollarsToCents(cleanCurrencyInput(item.value) || '0'),
        date: item.date
      } as HoldingSnapshot));

    case ImportDataTypeStringMappings.Budgets:
      return data.map((item: any) => ({
        amount: Math.round(parseFloat(item.amount) * 100), // Convert to cents
        categoryName: item.categoryName
      }));

    default:
      return data;
  }
} 