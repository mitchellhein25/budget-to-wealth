import { cleanCurrencyInput, convertDollarsToCents } from '@/app/lib/utils';
import { ImportDataTypeString, ImportDataType, HoldingSnapshotImport, HoldingImport, HoldingCategoryImport, CashFlowEntryImport, CashFlowCategoryImport, BudgetImport } from '@/app/import';

type RawCsvData = Record<string, string | number>;

export function transformImportData(data: RawCsvData[], dataType: ImportDataTypeString): ImportDataType[] { 
  switch (dataType) {
    case ImportDataTypeString.CashFlowEntries:
      return data.map((item: RawCsvData) => ({
        amountInCents: convertDollarsToCents(cleanCurrencyInput(item.amount.toString()) || '0'),
        date: item.date as string,
        categoryName: item.categoryName as string,
        description: item.description as string,
        categoryType: item.categoryType as "Income" | "Expense",
        recurrenceFrequency: item.recurrenceFrequency as "Daily" | "Weekly" | "Monthly" | "Yearly" | undefined,
      } as CashFlowEntryImport));

    case ImportDataTypeString.Holdings:
      return data.map((item: RawCsvData) => ({
        name: item.name as string,
        type: item.type as "Asset" | "Debt",
        holdingCategoryName: item.holdingCategoryName as string,
        institution: item.institution as string
      } as HoldingImport));

    case ImportDataTypeString.HoldingSnapshots:
      return data.map((item: RawCsvData) => ({
        holdingName: item.holdingName as string,
        date: item.date as string,
        balanceInCents: convertDollarsToCents(cleanCurrencyInput(item.balance.toString()) || '0'),
        holdingCategoryName: item.holdingCategoryName as string,
        holdingType: item.holdingType as "Asset" | "Debt",
        holdingInstitution: item.holdingInstitution as string ?? ""
      } as HoldingSnapshotImport));

    case ImportDataTypeString.Budgets:
      return data.map((item: RawCsvData) => ({
        categoryName: item.categoryName as string,
        amountInCents: convertDollarsToCents(cleanCurrencyInput(item.amount.toString()) || '0')
      } as BudgetImport));

    case ImportDataTypeString.HoldingCategories:
      return data.map((item: RawCsvData) => ({
        name: item.name as string
      } as HoldingCategoryImport));

    case ImportDataTypeString.CashFlowCategories:
      return data.map((item: RawCsvData) => ({
        name: item.name as string,
        categoryType: item.categoryType as "Income" | "Expense"
      } as CashFlowCategoryImport));

    default:
      return data as ImportDataType[];
  }
} 