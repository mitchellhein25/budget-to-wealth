import { ImportDataTypeStringMappings } from "../../../../lib/models/data-import/ImportDataTypeStringMappings";
import { ImportDataTypeStrings } from "../../../../lib/models/data-import/ImportDataTypeStrings";

export const getImportTemplateData = (dataTypeString: ImportDataTypeStrings) => {
  switch (dataTypeString) {
    case ImportDataTypeStringMappings.CashFlowEntries:
      return {
        headers: ['amount', 'categoryName', 'categoryType', 'date', 'description', 'recurrenceFrequency'],
        sampleData: [
          ['100.00', 'Groceries', 'Expense', '2024-01-15', 'Weekly grocery shopping', 'Weekly'],
          ['2500.00', 'Salary', 'Income', '2024-01-15', 'Monthly salary', 'Monthly'],
          ['50.00', 'Entertainment', 'Expense', '2024-01-16', 'Movie tickets', 'Monthly']
        ],
        description: 'Import cash flow entries with amount, category name, category type (Income/Expense), date, description (optional), and recurrence frequency (optional)'
      };
    case ImportDataTypeStringMappings.Budgets:
      return {
        headers: ['amount', 'categoryName', 'name'],
        sampleData: [
          ['500.00', 'Groceries', 'Monthly Groceries'],
          ['200.00', 'Entertainment', 'Monthly Entertainment'],
          ['1000.00', 'Transportation', 'Monthly Transportation']
        ],
        description: 'Import budgets with amount, category name, and budget name'
      };
    case ImportDataTypeStringMappings.HoldingSnapshots:
      return {
        headers: ['balance', 'holdingName', 'holdingCategoryName', 'holdingType', 'date'],
        sampleData: [
          ['5000.00', 'Savings Account', 'Cash', 'Asset', '2024-01-15'],
          ['25000.00', 'Investment Portfolio', 'Investments', 'Asset', '2024-01-15'],
          ['-1500.00', 'Credit Card', 'Credit', 'Debt', '2024-01-15']
        ],
        description: 'Import holding snapshots with balance, holding name, holding category name, holding type (Asset/Debt), and date'
      };
    case ImportDataTypeStringMappings.Holdings:
      return {
        headers: ['name', 'type', 'holdingCategoryName'],
        sampleData: [
          ['Savings Account', 'Asset', 'Cash'],
          ['Credit Card', 'Debt', 'Credit'],
          ['Investment Portfolio', 'Asset', 'Investments'],
          ['Car Loan', 'Debt', 'Loans'],
          ['Student Loan', 'Debt', 'Loans'],
          ['Home Loan', 'Debt', 'Loans']
        ],
        description: 'Import holdings with name, type (Asset/Debt), and holding category name'
      };
    case ImportDataTypeStringMappings.CashFlowCategories:
      return {
        headers: ['name', 'categoryType'],
        sampleData: [
          ['Restaurants', 'Expense'],
          ['Salary', 'Income'],
          ['Entertainment', 'Expense'],
          ['Television', 'Expense']
        ],
        description: 'Import cash flow categories with name and category type (Income/Expense)'
      };
    case ImportDataTypeStringMappings.HoldingCategories:
      return {
        headers: ['name'],
        sampleData: [
          ['Cash'],
          ['Credit'],
          ['Investments'],
          ['Loans']
        ],
        description: 'Import holding categories with name'
      };
    default:
      return { headers: [], sampleData: [], description: '' };
  }
};