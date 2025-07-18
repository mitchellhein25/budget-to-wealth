import { BudgetImport } from '../models/BudgetImport';
import { CashFlowCategoryImport } from '../models/CashFlowCategoryImport';
import { CashFlowEntryImport } from '../models/CashFlowEntryImport';
import { HoldingCategoryImport } from '../models/HoldingCategoryImport';
import { HoldingImport } from '../models/HoldingImport';
import { HoldingSnapshotImport } from '../models/HoldingSnapshotImport';
import { ImportDataType } from '../models/ImportDataType';
import { ImportDataTypeStringMappings } from '../models/ImportDataTypeStringMappings';
import { ImportDataTypeStrings } from '../models/ImportDataTypeStrings';
import { cleanCurrencyInput, convertDollarsToCents } from '../../../components/Utils';

type RawCsvData = Record<string, string | number>;

export function transformImportData(data: RawCsvData[], dataType: ImportDataTypeStrings): ImportDataType[] { 
  switch (dataType) {
    case ImportDataTypeStringMappings.CashFlowEntries:
      return data.map((item: RawCsvData) => ({
        amountInCents: convertDollarsToCents(cleanCurrencyInput(item.amount.toString()) || '0'),
        date: item.date as string,
        categoryName: item.categoryName as string,
        description: item.description as string,
        categoryType: item.categoryType as "Income" | "Expense",
        recurrenceFrequency: item.recurrenceFrequency as "Daily" | "Weekly" | "Monthly" | "Yearly" | undefined,
      } as CashFlowEntryImport));

    case ImportDataTypeStringMappings.Holdings:
      return data.map((item: RawCsvData) => ({
        name: item.name as string,
        type: item.type as "Asset" | "Debt",
        holdingCategoryName: item.holdingCategoryName as string,
        institution: item.institution as string
      } as HoldingImport));

    case ImportDataTypeStringMappings.HoldingSnapshots:
      return data.map((item: RawCsvData) => ({
        holdingName: item.holdingName as string,
        date: item.date as string,
        balanceInCents: convertDollarsToCents(cleanCurrencyInput(item.balance.toString()) || '0'),
        holdingCategoryName: item.holdingCategoryName as string,
        holdingType: item.holdingType as "Asset" | "Debt",
        holdingInstitution: item.holdingInstitution as string ?? ""
      } as HoldingSnapshotImport));

    case ImportDataTypeStringMappings.Budgets:
      return data.map((item: RawCsvData) => ({
        categoryName: item.categoryName as string,
        amountInCents: convertDollarsToCents(cleanCurrencyInput(item.amount.toString()) || '0')
      } as BudgetImport));

    case ImportDataTypeStringMappings.HoldingCategories:
      return data.map((item: RawCsvData) => ({
        name: item.name as string
      } as HoldingCategoryImport));

    case ImportDataTypeStringMappings.CashFlowCategories:
      return data.map((item: RawCsvData) => ({
        name: item.name as string,
        categoryType: item.categoryType as "Income" | "Expense"
      } as CashFlowCategoryImport));

    default:
      return data as ImportDataType[];
  }
} 