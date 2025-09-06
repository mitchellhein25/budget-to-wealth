import { ImportDataTypeString } from "@/app/import";

export const getImportTemplateData = (dataTypeString: ImportDataTypeString) => {
  switch (dataTypeString) {
    case ImportDataTypeString.CashFlowEntries:
      return {
        headers: ['amount', 'categoryName', 'categoryType', 'date', 'description', 'recurrenceFrequency'],
        sampleData: [
          ['100.00', 'Groceries', 'Expense', '2024-01-15', 'Weekly grocery shopping', 'Weekly'],
          ['2500.00', 'Salary', 'Income', '2024-01-15', 'Monthly salary', 'Monthly'],
          ['50.00', 'Entertainment', 'Expense', '2024-01-16', 'Movie tickets', 'Monthly']
        ],
        description: 'Import cash flow entries with amount, category name, category type (Income/Expense), date, description (optional), and recurrence frequency (optional)'
      };
    case ImportDataTypeString.Budgets:
      return {
        headers: ['amount', 'categoryName'],
        sampleData: [
          ['500.00', 'Groceries'],
          ['200.00', 'Entertainment'],
          ['1000.00', 'Transportation']
        ],
        description: 'Import budgets with amount, category name, and budget name'
      };
    case ImportDataTypeString.HoldingSnapshots:
      return {
        headers: ['balance', 'holdingName', 'holdingCategoryName', 'holdingType', 'date', 'holdingInstitution'],
        sampleData: [
          ['5000.00', 'Savings Account', 'Cash', 'Asset', '2024-01-15', 'Bank of America'],
          ['25000.00', 'Investment Portfolio', 'Investments', 'Asset', '2024-01-15', ''],
          ['-1500.00', 'Credit Card', 'Credit', 'Debt', '2024-01-15', 'American Express']
        ],
        description: 'Import holding snapshots with balance, holding name, holding category name, holding type (Asset/Debt), and date, and holding institution'
      };
    case ImportDataTypeString.Holdings:
      return {
        headers: ['name', 'type', 'holdingCategoryName', 'institution'],
        sampleData: [
          ['Savings Account', 'Asset', 'Cash', 'Bank of America'],
          ['Credit Card', 'Debt', 'Credit', 'American Express'],
          ['Investment Portfolio', 'Asset', 'Investments', ''],
          ['Car Loan', 'Debt', 'Loans', 'Chase'], 
          ['Student Loan', 'Debt', 'Loans', ''], 
          ['Home Loan', 'Debt', 'Loans', 'City National Bank']
        ],
        description: 'Import holdings with name, type (Asset/Debt), and holding category name'
      };
    case ImportDataTypeString.CashFlowCategories:
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
    case ImportDataTypeString.HoldingCategories:
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