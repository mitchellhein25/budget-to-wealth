import { ImportDataTypeStrings } from './ImportDataTypeStrings';
import { ImportResult } from './ImportResult';

export interface DataImportProps {
  dataType: ImportDataTypeStrings;
  onImportComplete?: (result: ImportResult) => void;
  onCancel?: () => void;
  className?: string;
} 