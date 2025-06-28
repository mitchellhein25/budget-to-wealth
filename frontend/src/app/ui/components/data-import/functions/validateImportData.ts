import { ImportDataType, ImportError } from '../DataImportTypes';

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