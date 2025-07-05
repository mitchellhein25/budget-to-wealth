import { cleanCurrencyInput } from '../../Utils';
import { ImportDataTypeStrings } from '../../../../lib/models/data-import/ImportDataTypeStrings';
import { ImportError } from '../../../../lib/models/data-import/ImportError';
import { getFieldsForImportType } from './getFieldsForImportType';

// Type for raw CSV data
type RawCsvData = Record<string, string | number | boolean>;

interface ValidationResult {
  success: boolean;
  data?: RawCsvData[];
  errors: ImportError[];
}

export function validateImportData(data: RawCsvData[], dataType: ImportDataTypeStrings | undefined): ValidationResult {
  const errors: ImportError[] = [];
  const successRows: RawCsvData[] = [];

  if (!dataType) {
    return {
      success: false,
      errors: [{ row: 0, message: 'Data type is required' }]
    };
  }

  const dataTypeFields = getFieldsForImportType(dataType);

  for (const [index, row] of data.entries()) {
    const rowIndex = index + 1;
    try {
      for (const importField of dataTypeFields.filter(field => field.required)) {
        if (!row[importField.name] || row[importField.name].toString().trim() === '') {
          errors.push({
            row: rowIndex,
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
            row: rowIndex,
            message: `${numberField.name} must be a valid currency value.`,
            field: numberField.name
          });
          continue;
        }
      }
      successRows.push(row);

    } catch (error) {
      errors.push({
        row: rowIndex,
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