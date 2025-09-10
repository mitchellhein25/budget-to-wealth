import { HoldingType, transformFormDataToHolding } from '@/app/net-worth/holding-snapshots/holdings';
import { getHoldingValidationResult } from '@/app/net-worth/holding-snapshots/holdings/components/form/functions/getHoldingValidationResult';

jest.mock('@/app/net-worth/holding-snapshots/holdings/components/form/functions/getHoldingValidationResult', () => ({
  getHoldingValidationResult: jest.fn(),
}));

const mockGetHoldingValidationResult = getHoldingValidationResult as jest.MockedFunction<typeof getHoldingValidationResult>;

describe('transformFormDataToHolding', () => {
  let mockFormData: FormData;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormData = new FormData();
  });

  it('successfully transforms valid form data', () => {
    const mockValidatedData = {
      name: 'Test Holding',
      type: 'Stock' as HoldingType,
      holdingCategoryId: '123',
      institution: 'Test Bank'
    };

    mockGetHoldingValidationResult.mockReturnValue({
      success: true,
      data: mockValidatedData
    } as any);

    const result = transformFormDataToHolding(mockFormData);

    expect(mockGetHoldingValidationResult).toHaveBeenCalledWith(mockFormData);
    expect(result.item).toEqual({
      name: 'Test Holding',
      type: 'Stock',
      holdingCategoryId: '123',
      institution: 'Test Bank'
    });
    expect(result.errors).toEqual([]);
  });

  it('returns errors when validation fails', () => {
    const mockValidationError = {
      success: false,
      error: {
        errors: [{ message: 'Invalid holding name' }]
      }
    };

    mockGetHoldingValidationResult.mockReturnValue(mockValidationError as any);

    const result = transformFormDataToHolding(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Invalid holding name']);
  });
});
