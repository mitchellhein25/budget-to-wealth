import { ImportDataType, ImportDataTypeStringMappings, ImportDataTypeStrings, ImportResult } from '../DataImportTypes';
import { postRequest } from '@/app/lib/api/rest-methods/postRequest';

export async function uploadImportData(data: ImportDataType[], dataType: ImportDataTypeStrings): Promise<ImportResult> {
  const errors: any[] = [];
  let importedCount = 0;

  try {
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

function getEndpointForDataType(dataType: ImportDataTypeStrings): string {
  switch (dataType) {
    case ImportDataTypeStringMappings.CashFlowCategories:
      return 'CashFlowCategories/Import';
    case ImportDataTypeStringMappings.Budgets:
      return 'Budgets/Import';
    case ImportDataTypeStringMappings.CashFlowEntries:
      return 'CashFlowEntries/Import';
    case ImportDataTypeStringMappings.HoldingCategories:
      return 'HoldingCategories/Import';
    case ImportDataTypeStringMappings.Holdings:
      return 'Holdings/Import';
    case ImportDataTypeStringMappings.HoldingSnapshots:
      return 'HoldingSnapshots/Import';
    default:
      throw new Error(`Unknown data type: ${dataType}`);
  }
} 