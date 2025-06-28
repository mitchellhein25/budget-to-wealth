import { ImportDataType, ImportResult } from '../DataImportTypes';
import { postRequest } from '@/app/lib/api/rest-methods/postRequest';

export async function uploadImportData(data: any[], dataType: ImportDataType): Promise<ImportResult> {
  const errors: any[] = [];
  let importedCount = 0;

  try {
    // Process data in batches to avoid overwhelming the server
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (item, index) => {
        try {
          const endpoint = getEndpointForDataType(dataType);
          const response = await postRequest(endpoint, item);
          
          if (!response.successful) {
            throw new Error(response.responseMessage || 'Upload failed');
          }
          
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error',
            row: index + 1
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach(result => {
        if (result.success) {
          importedCount++;
        } else {
          errors.push({
            row: result.row,
            message: result.error
          });
        }
      });
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 
        ? `Successfully imported ${importedCount} items`
        : `Imported ${importedCount} items with ${errors.length} errors`,
      importedCount,
      errorCount: errors.length,
      errors
    };

  } catch (error) {
    return {
      success: false,
      message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      importedCount: 0,
      errorCount: data.length,
      errors: []
    };
  }
}

function getEndpointForDataType(dataType: ImportDataType): string {
  switch (dataType) {
    case 'CashFlowEntry':
      return 'CashFlowEntries/import';
    case 'Holding':
      return 'Holdings/import';
    case 'HoldingSnapshot':
      return 'HoldingSnapshots/import';
    case 'Budget':
      return 'Budgets/import';
    default:
      throw new Error(`Unknown data type: ${dataType}`);
  }
} 