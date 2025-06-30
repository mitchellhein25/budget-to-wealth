import { cleanCurrencyInput } from '../../Utils';
import { ImportDataType, ImportError } from '../DataImportTypes';
import { getFieldsForImportType, ImportField } from './getFieldsForImportType';

interface ValidationResult {
  success: boolean;
  data?: any[];
  errors: ImportError[];
}

export function validateImportData(data: any[], dataType: string): ValidationResult {
  const errors: ImportError[] = [];
  const successRows: any[] = [];
  const dataTypeFields = getFieldsForImportType(dataType);

  for (const [index, row] of data.entries()) {
    if (index === 0) 
      continue;

    try {
      for (const importField of dataTypeFields.filter(field => field.required)) {
        if (!row[importField.name] || row[importField.name].toString().trim() === '') {
          errors.push({
            row: index,
            message: `${importField.name} is required`,
            field: importField.name
          });
          continue;
        }
      }

      const numberField = dataTypeFields.find(field => field.name === 'amount' || field.name === 'balance');
      if (numberField?.required) {
        const amount = cleanCurrencyInput(row[numberField.name].toString());
        if (!amount) {
          errors.push({
            row: index,
            message: `${numberField.name} must be a valid currency value.`,
            field: numberField.name
          });
          continue;
        }
      }
      successRows.push(row);

    } catch (error) {
      errors.push({
        row: index,
        message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  return {
    success: errors.length === 0,
    data: successRows,
    errors
  };
}