import { ImportDataType, ImportError, CashFlowEntryImport, HoldingImport, HoldingSnapshotImport, BudgetImport } from '../ExcelImportTypes';

interface ValidationResult {
  success: boolean;
  data?: any[];
  errors: ImportError[];
}

export function validateImportData(data: any[], dataType: ImportDataType): ValidationResult {
  const errors: ImportError[] = [];
  const validatedData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because Excel is 1-indexed and we have headers
    
    try {
      switch (dataType) {
        case 'CashFlowEntry':
          validateCashFlowEntry(row, rowNumber, errors, validatedData);
          break;
        case 'Holding':
          validateHolding(row, rowNumber, errors, validatedData);
          break;
        case 'HoldingSnapshot':
          validateHoldingSnapshot(row, rowNumber, errors, validatedData);
          break;
        case 'Budget':
          validateBudget(row, rowNumber, errors, validatedData);
          break;
      }
    } catch (error) {
      errors.push({
        row: rowNumber,
        message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  return {
    success: errors.length === 0,
    data: validatedData,
    errors
  };
}

function validateCashFlowEntry(row: any, rowNumber: number, errors: ImportError[], validatedData: any[]) {
  const requiredFields = ['amount', 'date', 'categoryName', 'entryType'];
  
  for (const field of requiredFields) {
    if (!row[field] || row[field].toString().trim() === '') {
      errors.push({
        row: rowNumber,
        message: `${field} is required`,
        field
      });
      return;
    }
  }

  // Validate amount
  const amount = parseFloat(row.amount.toString().replace(/[$,]/g, ''));
  if (isNaN(amount) || amount <= 0) {
    errors.push({
      row: rowNumber,
      message: 'Amount must be a positive number',
      field: 'amount'
    });
    return;
  }

  // Validate date
  const date = new Date(row.date);
  if (isNaN(date.getTime())) {
    errors.push({
      row: rowNumber,
      message: 'Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY',
      field: 'date'
    });
    return;
  }

  // Validate entry type
  if (!['Income', 'Expense'].includes(row.entryType)) {
    errors.push({
      row: rowNumber,
      message: 'Entry type must be either "Income" or "Expense"',
      field: 'entryType'
    });
    return;
  }

  validatedData.push({
    amount: amount.toFixed(2),
    date: date.toISOString().split('T')[0],
    categoryName: row.categoryName.toString().trim(),
    description: row.description?.toString().trim() || '',
    entryType: row.entryType
  } as CashFlowEntryImport);
}

function validateHolding(row: any, rowNumber: number, errors: ImportError[], validatedData: any[]) {
  const requiredFields = ['name', 'type', 'categoryName'];
  
  for (const field of requiredFields) {
    if (!row[field] || row[field].toString().trim() === '') {
      errors.push({
        row: rowNumber,
        message: `${field} is required`,
        field
      });
      return;
    }
  }

  // Validate type
  if (!['Asset', 'Debt'].includes(row.type)) {
    errors.push({
      row: rowNumber,
      message: 'Type must be either "Asset" or "Debt"',
      field: 'type'
    });
    return;
  }

  validatedData.push({
    name: row.name.toString().trim(),
    type: row.type,
    categoryName: row.categoryName.toString().trim()
  } as HoldingImport);
}

function validateHoldingSnapshot(row: any, rowNumber: number, errors: ImportError[], validatedData: any[]) {
  const requiredFields = ['holdingName', 'value', 'date'];
  
  for (const field of requiredFields) {
    if (!row[field] || row[field].toString().trim() === '') {
      errors.push({
        row: rowNumber,
        message: `${field} is required`,
        field
      });
      return;
    }
  }

  // Validate value
  const value = parseFloat(row.value.toString().replace(/[$,]/g, ''));
  if (isNaN(value)) {
    errors.push({
      row: rowNumber,
      message: 'Value must be a valid number',
      field: 'value'
    });
    return;
  }

  // Validate date
  const date = new Date(row.date);
  if (isNaN(date.getTime())) {
    errors.push({
      row: rowNumber,
      message: 'Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY',
      field: 'date'
    });
    return;
  }

  validatedData.push({
    holdingName: row.holdingName.toString().trim(),
    value: value.toFixed(2),
    date: date.toISOString().split('T')[0]
  } as HoldingSnapshotImport);
}

function validateBudget(row: any, rowNumber: number, errors: ImportError[], validatedData: any[]) {
  const requiredFields = ['amount', 'categoryName'];
  
  for (const field of requiredFields) {
    if (!row[field] || row[field].toString().trim() === '') {
      errors.push({
        row: rowNumber,
        message: `${field} is required`,
        field
      });
      return;
    }
  }

  // Validate amount
  const amount = parseFloat(row.amount.toString().replace(/[$,]/g, ''));
  if (isNaN(amount) || amount <= 0) {
    errors.push({
      row: rowNumber,
      message: 'Amount must be a positive number',
      field: 'amount'
    });
    return;
  }

  validatedData.push({
    amount: amount.toFixed(2),
    categoryName: row.categoryName.toString().trim()
  } as BudgetImport);
} 