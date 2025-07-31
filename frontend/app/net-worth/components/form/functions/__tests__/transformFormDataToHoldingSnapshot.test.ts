import { transformFormDataToHoldingSnapshot } from '../transformFormDataToHoldingSnapshot';
import { HoldingSnapshot } from '@/app/net-worth/components/HoldingSnapshot';

// Mock the dependencies
jest.mock('../getHoldingSnapshotValidationResult', () => ({
  getHoldingSnapshotValidationResult: jest.fn()
}));

jest.mock('@/app/components/Utils', () => ({
  convertDollarsToCents: jest.fn()
}));

describe('transformFormDataToHoldingSnapshot', () => {
  const mockGetHoldingSnapshotValidationResult = require('../getHoldingSnapshotValidationResult').getHoldingSnapshotValidationResult as jest.MockedFunction<any>;
  const mockConvertDollarsToCents = require('@/app/components/Utils').convertDollarsToCents as jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully transforms valid form data', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: {
        holdingId: 'holding-123',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      }
    });

    mockConvertDollarsToCents.mockReturnValue(100050);

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toEqual({
      holdingId: 'holding-123',
      date: '2024-01-15',
      balance: 100050
    });
    expect(result.errors).toEqual([]);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(formData);
    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('1000.50');
  });

  it('handles validation errors correctly', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', '');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: false,
      error: {
        errors: [
          { message: 'Holding field is required' },
          { message: 'Balance must be greater than 0' }
        ]
      }
    });

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Holding field is required']);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(formData);
    expect(mockConvertDollarsToCents).not.toHaveBeenCalled();
  });

  it('handles invalid balance format', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', 'invalid-balance');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: {
        holdingId: 'holding-123',
        date: new Date('2024-01-15'),
        balance: 'invalid-balance'
      }
    });

    mockConvertDollarsToCents.mockReturnValue(null);

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Invalid balance format']);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(formData);
    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('invalid-balance');
  });

  it('handles zero balance correctly', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '0');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: {
        holdingId: 'holding-123',
        date: new Date('2024-01-15'),
        balance: '0'
      }
    });

    mockConvertDollarsToCents.mockReturnValue(0);

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toEqual({
      holdingId: 'holding-123',
      date: '2024-01-15',
      balance: 0
    });
    expect(result.errors).toEqual([]);
    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('0');
  });

  it('handles decimal balance values correctly', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1234.56');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: {
        holdingId: 'holding-123',
        date: new Date('2024-01-15'),
        balance: '1234.56'
      }
    });

    mockConvertDollarsToCents.mockReturnValue(123456);

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toEqual({
      holdingId: 'holding-123',
      date: '2024-01-15',
      balance: 123456
    });
    expect(result.errors).toEqual([]);
    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('1234.56');
  });

  it('handles large balance values correctly', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000000.00');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: {
        holdingId: 'holding-123',
        date: new Date('2024-01-15'),
        balance: '1000000.00'
      }
    });

    mockConvertDollarsToCents.mockReturnValue(100000000);

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toEqual({
      holdingId: 'holding-123',
      date: '2024-01-15',
      balance: 100000000
    });
    expect(result.errors).toEqual([]);
    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('1000000.00');
  });

  it('handles date conversion correctly', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-12-31');
    formData.append('holding-snapshot-balance', '1000.00');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: {
        holdingId: 'holding-123',
        date: new Date('2024-12-31'),
        balance: '1000.00'
      }
    });

    mockConvertDollarsToCents.mockReturnValue(100000);

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toEqual({
      holdingId: 'holding-123',
      date: '2024-12-31',
      balance: 100000
    });
    expect(result.errors).toEqual([]);
  });

  it('handles validation errors with multiple messages', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', '');
    formData.append('holding-snapshot-date', '');
    formData.append('holding-snapshot-balance', '');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: false,
      error: {
        errors: [
          { message: 'Holding field is required' },
          { message: 'Date field is required' },
          { message: 'Balance field is required' }
        ]
      }
    });

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Holding field is required']);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(formData);
    expect(mockConvertDollarsToCents).not.toHaveBeenCalled();
  });

  it('handles unexpected errors gracefully', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    mockGetHoldingSnapshotValidationResult.mockImplementation(() => {
      throw new Error('Unexpected validation error');
    });

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.\nUnexpected validation error']);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(formData);
    expect(mockConvertDollarsToCents).not.toHaveBeenCalled();
  });

  it('handles errors without message property', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    mockGetHoldingSnapshotValidationResult.mockImplementation(() => {
      throw new Error();
    });

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.\n']);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(formData);
    expect(mockConvertDollarsToCents).not.toHaveBeenCalled();
  });

  it('handles non-Error exceptions', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    mockGetHoldingSnapshotValidationResult.mockImplementation(() => {
      throw 'String error';
    });

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.']);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(formData);
    expect(mockConvertDollarsToCents).not.toHaveBeenCalled();
  });

  it('handles balance with commas and spaces', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1,234.56');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: {
        holdingId: 'holding-123',
        date: new Date('2024-01-15'),
        balance: '1,234.56'
      }
    });

    mockConvertDollarsToCents.mockReturnValue(123456);

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toEqual({
      holdingId: 'holding-123',
      date: '2024-01-15',
      balance: 123456
    });
    expect(result.errors).toEqual([]);
    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('1,234.56');
  });

  it('handles optional id field correctly', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-id', 'snapshot-123');
    formData.append('holding-snapshot-holdingId', 'holding-123');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: {
        id: 'snapshot-123',
        holdingId: 'holding-123',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      }
    });

    mockConvertDollarsToCents.mockReturnValue(100050);

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toEqual({
      holdingId: 'holding-123',
      date: '2024-01-15',
      balance: 100050
    });
    expect(result.errors).toEqual([]);
  });

  it('handles empty form data gracefully', () => {
    const formData = new FormData();

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: false,
      error: {
        errors: [
          { message: 'Holding field is required' }
        ]
      }
    });

    const result = transformFormDataToHoldingSnapshot(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Holding field is required']);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(formData);
    expect(mockConvertDollarsToCents).not.toHaveBeenCalled();
  });
}); 