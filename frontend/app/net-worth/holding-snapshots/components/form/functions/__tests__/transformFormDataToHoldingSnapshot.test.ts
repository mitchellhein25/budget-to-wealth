import { getHoldingSnapshotValidationResult, transformFormDataToHoldingSnapshot } from '@/app/net-worth/holding-snapshots';
import { convertDollarsToCents } from '@/app/lib/utils';

jest.mock('@/app/net-worth/holding-snapshots/components/form/functions/getHoldingSnapshotValidationResult');
jest.mock('@/app/lib/utils', () => {
  const actual = jest.requireActual('@/app/lib/utils');
  return {
    ...actual,
    convertDollarsToCents: jest.fn(),
  };
});

const mockGetHoldingSnapshotValidationResult = getHoldingSnapshotValidationResult as jest.MockedFunction<typeof getHoldingSnapshotValidationResult>;
const mockConvertDollarsToCents = convertDollarsToCents as jest.MockedFunction<typeof convertDollarsToCents>;

describe('transformFormDataToHoldingSnapshot', () => {
  let mockFormData: FormData;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormData = new FormData();
  });

  it('successfully transforms valid form data', () => {
    const mockValidatedData = {
      holdingId: '123',
      date: new Date('2024-01-01'),
      balance: '1000.50'
    };

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: mockValidatedData
    });

    mockConvertDollarsToCents.mockReturnValue(100050);

    const result = transformFormDataToHoldingSnapshot(mockFormData);

    expect(result.item).toEqual({
      holdingId: '123',
      date: '2024-01-01',
      balance: 100050
    });
    expect(result.errors).toEqual([]);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(mockFormData);
    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('1000.50');
  });

  it('returns errors when validation fails', () => {
    const mockValidationError = {
      success: false as const,
      error: { errors: [{ message: 'Invalid holding ID' }] }
    } as unknown as ReturnType<typeof getHoldingSnapshotValidationResult>;

    mockGetHoldingSnapshotValidationResult.mockReturnValue(mockValidationError);

    const result = transformFormDataToHoldingSnapshot(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Invalid holding ID']);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(mockFormData);
  });

  it('returns error when balance conversion fails', () => {
    const mockValidatedData = {
      holdingId: '123',
      date: new Date('2024-01-01'),
      balance: 'invalid-balance'
    };

    mockGetHoldingSnapshotValidationResult.mockReturnValue({
      success: true,
      data: mockValidatedData
    });

    mockConvertDollarsToCents.mockReturnValue(null);

    const result = transformFormDataToHoldingSnapshot(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Invalid balance format']);
    expect(mockGetHoldingSnapshotValidationResult).toHaveBeenCalledWith(mockFormData);
    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('invalid-balance');
  });

  it('handles unexpected errors gracefully', () => {
    mockGetHoldingSnapshotValidationResult.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const result = transformFormDataToHoldingSnapshot(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.\nUnexpected error']);
  });

  it('handles errors without message property', () => {
    mockGetHoldingSnapshotValidationResult.mockImplementation(() => {
      throw 'String error';
    });

    const result = transformFormDataToHoldingSnapshot(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.']);
  });
});
