import { transformFormDataToHolding } from '../transformFormDataToHolding';
import { getHoldingValidationResult } from '../getHoldingValidationResult';
import { HoldingType } from '../../HoldingType';

jest.mock('../getHoldingValidationResult');

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
    });

    const result = transformFormDataToHolding(mockFormData);

    expect(result.item).toEqual({
      name: 'Test Holding',
      type: 'Stock',
      holdingCategoryId: '123',
      institution: 'Test Bank'
    });
    expect(result.errors).toEqual([]);
    expect(mockGetHoldingValidationResult).toHaveBeenCalledWith(mockFormData);
  });

  it('returns errors when validation fails', () => {
    const mockValidationError = {
      success: false,
      error: {
        errors: [{ message: 'Invalid holding name' }]
      }
    };

    mockGetHoldingValidationResult.mockReturnValue(mockValidationError);

    const result = transformFormDataToHolding(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Invalid holding name']);
    expect(mockGetHoldingValidationResult).toHaveBeenCalledWith(mockFormData);
  });

  it('handles unexpected errors gracefully', () => {
    mockGetHoldingValidationResult.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const result = transformFormDataToHolding(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.\nUnexpected error']);
  });

  it('handles errors without message property', () => {
    mockGetHoldingValidationResult.mockImplementation(() => {
      throw 'String error';
    });

    const result = transformFormDataToHolding(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.']);
  });
});
