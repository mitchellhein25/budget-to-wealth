import { ImportDataType } from '../../../../lib/models/data-import/ImportDataType';
import { ImportDataTypeStringMappings } from '../../../../lib/models/data-import/ImportDataTypeStringMappings';
import { ImportDataTypeStrings } from '../../../../lib/models/data-import/ImportDataTypeStrings';
import { ImportResult } from '../../../../lib/models/data-import/ImportResult';
import { ImportItemResult } from '../../../../lib/models/data-import/ImportItemResult';
import { postRequest } from '@/app/lib/api/rest-methods/postRequest';

export async function uploadImportData(data: ImportDataType[], dataType: ImportDataTypeStrings): Promise<ImportResult> {
  const batchSize = 100;
  const batches = [];
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize));
  }

  const allResults: ImportItemResult[] = [];
  let totalImportedCount = 0;
  let totalErrorCount = 0;
  let overallSuccess = true;
  const batchMessages: string[] = [];

  for (const [batchIndex, batch] of batches.entries()) {
    const endpoint = getEndpointForDataType(dataType);
    const response = await postRequest(endpoint, batch);

    if (!response.successful || !response.data) {
      for (let i = 0; i < batch.length; i++) {
        allResults.push({
          success: false,
          message: response.responseMessage || 'Upload failed',
          row: batchIndex * batchSize + i + 1,
        });
      }
      totalErrorCount += batch.length;
      overallSuccess = false;
      batchMessages.push(`Batch ${batchIndex + 1}: ${response.responseMessage || 'Upload failed'}`);
      continue;
    }

    const importResult = response.data as ImportResult;

    importResult.results.forEach(r => {
      allResults.push({
        ...r,
        row: r.row + batchIndex * batchSize,
      });
    });
    totalImportedCount += importResult.importedCount;
    totalErrorCount += importResult.errorCount;
    if (!importResult.success) {
      overallSuccess = false;
      batchMessages.push(`Batch ${batchIndex + 1}: ${importResult.message}`);
    }
  }

  const overallMessage = overallSuccess
    ? `Successfully imported ${totalImportedCount} items${totalErrorCount > 0 ? ` with ${totalErrorCount} errors` : ''}`
    : `Imported ${totalImportedCount} items with ${totalErrorCount} errors`;

  return {
    success: overallSuccess,
    message: overallMessage,
    importedCount: totalImportedCount,
    errorCount: totalErrorCount,
    results: allResults,
  };
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