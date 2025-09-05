import { uploadImportData, ImportDataTypeStringMappings, ImportDataTypeStrings } from '@/app/import';
import { postRequest } from '@/app/lib/api';

jest.mock('@/app/lib/api');

const mockPostRequest = postRequest as jest.MockedFunction<typeof postRequest>;

describe('uploadImportData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully uploads data in batches', async () => {
    const mockData = Array.from({ length: 250 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: true,
        message: 'Successfully imported 100 items',
        importedCount: 100,
        errorCount: 0,
        results: Array.from({ length: 100 }, (_, i) => ({
          success: true,
          message: 'Success',
          row: i + 1
        }))
      },
      responseMessage: 'Success'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(300);
    expect(result.errorCount).toBe(0);
    expect(result.message).toContain('Successfully imported 300 items');
    expect(result.results).toHaveLength(300);
    expect(mockPostRequest).toHaveBeenCalledTimes(3);
  });

  it('handles API errors gracefully', async () => {
    const mockData = [{ id: 1, name: 'Test Item' }];
    
    mockPostRequest.mockResolvedValue({
      successful: false,
      data: null,
      responseMessage: 'Not authorized.'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.importedCount).toBe(0);
    expect(result.errorCount).toBe(1);
    expect(result.message).toContain('Imported 0 items with 1 errors');
    expect(result.results).toHaveLength(1);
    expect(result.results[0].success).toBe(false);
    expect(result.results[0].message).toBe('Not authorized.');
  });

  it('handles partial batch failures', async () => {
    const mockData = Array.from({ length: 150 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest
      .mockResolvedValueOnce({
        successful: true,
        data: {
          success: true,
          message: 'Successfully imported 100 items',
          importedCount: 100,
          errorCount: 0,
          results: Array.from({ length: 100 }, (_, i) => ({
            success: true,
            message: 'Success',
            row: i + 1
          }))
        },
        responseMessage: 'Success'
      })
      .mockResolvedValueOnce({
        successful: false,
        data: null,
        responseMessage: 'Server error'
      });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.importedCount).toBe(100);
    expect(result.errorCount).toBe(50);
    expect(result.message).toContain('Imported 100 items with 50 errors');
    expect(result.results).toHaveLength(150);
    expect(mockPostRequest).toHaveBeenCalledTimes(2);
  });

  it('handles mixed success and error results within a batch', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: false,
        message: 'Some items failed',
        importedCount: 1,
        errorCount: 1,
        results: [
          { success: true, message: 'Success', row: 1 },
          { success: false, message: 'Validation failed', row: 2 }
        ]
      },
      responseMessage: 'Partial success'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.importedCount).toBe(1);
    expect(result.errorCount).toBe(1);
    expect(result.message).toContain('Imported 1 items with 1 errors');
    expect(result.results).toHaveLength(2);
    expect(result.results[0].success).toBe(true);
    expect(result.results[1].success).toBe(false);
  });

  it('handles empty data array', async () => {
    const result = await uploadImportData([], ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(0);
    expect(result.errorCount).toBe(0);
    expect(result.message).toContain('Successfully imported 0 items');
    expect(result.results).toHaveLength(0);
    expect(mockPostRequest).not.toHaveBeenCalled();
  });

  it('uses correct endpoints for different data types', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: true,
        message: 'Success',
        importedCount: 1,
        errorCount: 0,
        results: [{ success: true, message: 'Success', row: 1 }]
      },
      responseMessage: 'Success'
    });

    await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);
    expect(mockPostRequest).toHaveBeenCalledWith('CashFlowEntries/Import', mockData);

    await uploadImportData(mockData, ImportDataTypeStringMappings.Budgets);
    expect(mockPostRequest).toHaveBeenCalledWith('Budgets/Import', mockData);

    await uploadImportData(mockData, ImportDataTypeStringMappings.Holdings);
    expect(mockPostRequest).toHaveBeenCalledWith('Holdings/Import', mockData);
  });

  it('handles large datasets with multiple batches', async () => {
    const mockData = Array.from({ length: 350 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: true,
        message: 'Success',
        importedCount: 100,
        errorCount: 0,
        results: Array.from({ length: 100 }, (_, i) => ({
          success: true,
          message: 'Success',
          row: i + 1
        }))
      },
      responseMessage: 'Success'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(400);
    expect(result.errorCount).toBe(0);
    expect(result.results).toHaveLength(400);
    expect(mockPostRequest).toHaveBeenCalledTimes(4);
  });

  it('correctly adjusts row numbers for batched results', async () => {
    const mockData = Array.from({ length: 150 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest
      .mockResolvedValueOnce({
        successful: true,
        data: {
          success: true,
          message: 'Success',
          importedCount: 100,
          errorCount: 0,
          results: Array.from({ length: 100 }, (_, i) => ({
            success: true,
            message: 'Success',
            row: i + 1
          }))
        },
        responseMessage: 'Success'
      })
      .mockResolvedValueOnce({
        successful: true,
        data: {
          success: true,
          message: 'Success',
          importedCount: 50,
          errorCount: 0,
          results: Array.from({ length: 50 }, (_, i) => ({
            success: true,
            message: 'Success',
            row: i + 1
          }))
        },
        responseMessage: 'Success'
      });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.results[0].row).toBe(1);
    expect(result.results[99].row).toBe(100);
    expect(result.results[100].row).toBe(101);
    expect(result.results[149].row).toBe(150);
  });

  it('handles network errors', async () => {
    const mockData = [{ id: 1, name: 'Test Item' }];
    
    mockPostRequest.mockRejectedValue(new Error('Network error'));

    await expect(uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries))
      .rejects.toThrow('Network error');
  });

  it('handles unknown data types', async () => {
    const mockData = [{ id: 1, name: 'Test Item' }];

    await expect(uploadImportData(mockData, 'Unknown Type' as ImportDataTypeStrings))
      .rejects.toThrow('Unknown data type: Unknown Type');
  });

  it('aggregates error messages from multiple batches', async () => {
    const mockData = Array.from({ length: 200 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest
      .mockResolvedValueOnce({
        successful: false,
        data: null,
        responseMessage: 'First batch failed'
      })
      .mockResolvedValueOnce({
        successful: false,
        data: null,
        responseMessage: 'Second batch failed'
      });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.importedCount).toBe(0);
    expect(result.errorCount).toBe(200);
    expect(result.message).toContain('Imported 0 items with 200 errors');
    expect(result.results).toHaveLength(200);
    expect(result.results.every(r => !r.success)).toBe(true);
  });

  it('handles successful uploads with some errors', async () => {
    const mockData = Array.from({ length: 50 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: false,
        message: 'Some items failed',
        importedCount: 30,
        errorCount: 20,
        results: [
          ...Array.from({ length: 30 }, (_, i) => ({
            success: true,
            message: 'Success',
            row: i + 1
          })),
          ...Array.from({ length: 20 }, (_, i) => ({
            success: false,
            message: 'Validation failed',
            row: i + 31
          }))
        ]
      },
      responseMessage: 'Partial success'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.importedCount).toBe(30);
    expect(result.errorCount).toBe(20);
    expect(result.message).toContain('Imported 30 items with 20 errors');
    expect(result.results).toHaveLength(50);
    expect(result.results.filter(r => r.success)).toHaveLength(30);
    expect(result.results.filter(r => !r.success)).toHaveLength(20);
  });

  it('handles API response without responseMessage', async () => {
    const mockData = [{ id: 1, name: 'Test Item' }];
    
    mockPostRequest.mockResolvedValue({
      successful: false,
      data: null,
      responseMessage: ""
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.importedCount).toBe(0);
    expect(result.errorCount).toBe(1);
    expect(result.message).toContain('Imported 0 items with 1 errors');
    expect(result.results).toHaveLength(1);
    expect(result.results[0].success).toBe(false);
    expect(result.results[0].message).toBe('Upload failed');
  });

  it('handles import result without message', async () => {
    const mockData = [{ id: 1, name: 'Test Item' }];
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: false,
        message: undefined,
        importedCount: 0,
        errorCount: 1,
        results: [
          { success: false, message: 'Validation failed', row: 1 }
        ]
      },
      responseMessage: 'Success'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.importedCount).toBe(0);
    expect(result.errorCount).toBe(1);
    expect(result.message).toContain('Imported 0 items with 1 errors');
    expect(result.results).toHaveLength(1);
    expect(result.results[0].success).toBe(false);
  });

  it('handles successful upload with errors in message', async () => {
    const mockData = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: true,
        message: 'Successfully imported 8 items with 2 errors',
        importedCount: 8,
        errorCount: 2,
        results: [
          ...Array.from({ length: 8 }, (_, i) => ({
            success: true,
            message: 'Success',
            row: i + 1
          })),
          ...Array.from({ length: 2 }, (_, i) => ({
            success: false,
            message: 'Validation failed',
            row: i + 9
          }))
        ]
      },
      responseMessage: 'Partial success'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(8);
    expect(result.errorCount).toBe(2);
    expect(result.message).toContain('Successfully imported 8 items with 2 errors');
    expect(result.results).toHaveLength(10);
    expect(result.results.filter(r => r.success)).toHaveLength(8);
    expect(result.results.filter(r => !r.success)).toHaveLength(2);
  });

  it('handles successful upload with no errors', async () => {
    const mockData = Array.from({ length: 5 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: true,
        message: 'Successfully imported 5 items',
        importedCount: 5,
        errorCount: 0,
        results: Array.from({ length: 5 }, (_, i) => ({
          success: true,
          message: 'Success',
          row: i + 1
        }))
      },
      responseMessage: 'Success'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(5);
    expect(result.errorCount).toBe(0);
    expect(result.message).toContain('Successfully imported 5 items');
    expect(result.message).not.toContain('with 0 errors');
    expect(result.results).toHaveLength(5);
    expect(result.results.every(r => r.success)).toBe(true);
  });

  it('handles successful upload with errors but no message in importResult', async () => {
    const mockData = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: false,
        message: undefined as string | undefined,
        importedCount: 8,
        errorCount: 2,
        results: [
          ...Array.from({ length: 8 }, (_, i) => ({
            success: true,
            message: 'Success',
            row: i + 1
          })),
          ...Array.from({ length: 2 }, (_, i) => ({
            success: false,
            message: 'Validation failed',
            row: i + 9
          }))
        ]
      },
      responseMessage: 'Partial success'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.importedCount).toBe(8);
    expect(result.errorCount).toBe(2);
    expect(result.message).toContain('Imported 8 items with 2 errors');
    expect(result.results).toHaveLength(10);
    expect(result.results.filter(r => r.success)).toHaveLength(8);
    expect(result.results.filter(r => !r.success)).toHaveLength(2);
  });

  it('handles successful upload with errors in success message', async () => {
    const mockData = Array.from({ length: 15 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    mockPostRequest.mockResolvedValue({
      successful: true,
      data: {
        success: true,
        message: 'Successfully imported 12 items with 3 errors',
        importedCount: 12,
        errorCount: 3,
        results: [
          ...Array.from({ length: 12 }, (_, i) => ({
            success: true,
            message: 'Success',
            row: i + 1
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            success: false,
            message: 'Validation failed',
            row: i + 13
          }))
        ]
      },
      responseMessage: 'Partial success'
    });

    const result = await uploadImportData(mockData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(12);
    expect(result.errorCount).toBe(3);
    expect(result.message).toContain('Successfully imported 12 items with 3 errors');
    expect(result.results).toHaveLength(15);
    expect(result.results.filter(r => r.success)).toHaveLength(12);
    expect(result.results.filter(r => !r.success)).toHaveLength(3);
  });
}); 