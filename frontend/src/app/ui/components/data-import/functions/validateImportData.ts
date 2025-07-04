import { HoldingSnapshot } from '@/app/lib/models/net-worth/HoldingSnapshot';
import { cleanCurrencyInput } from '../../Utils';
import { ImportDataType, ImportDataTypeStringMappings, ImportDataTypeStrings, ImportError } from '../DataImportTypes';
import { getFieldsForImportType, ImportField } from './getFieldsForImportType';
import { CashFlowEntry } from '@/app/lib/models/cashflow/CashFlowEntry';
import { Holding } from '@/app/lib/models/net-worth/Holding';
import { Budget } from '@/app/lib/models/cashflow/Budget';
import { Category } from '@/app/lib/models/Category';

interface ValidationResult {
  success: boolean;
  data?: any[];
  errors: ImportError[];
}

export function validateImportData(data: any[], dataType: ImportDataTypeStrings | undefined): ValidationResult {
  const errors: ImportError[] = [];
  const successRows: any[] = [];

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