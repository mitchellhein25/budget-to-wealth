import { ImportDataTypeString, ImportResult } from '@/app/import';

export interface DataImportProps {
  dataType: ImportDataTypeString;
  onImportComplete?: (result: ImportResult) => void;
  onCancel?: () => void;
  className?: string;
} 