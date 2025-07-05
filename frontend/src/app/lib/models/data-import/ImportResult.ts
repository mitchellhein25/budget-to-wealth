import { ImportItemResult } from './ImportItemResult';

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errorCount: number;
  results: ImportItemResult[];
} 