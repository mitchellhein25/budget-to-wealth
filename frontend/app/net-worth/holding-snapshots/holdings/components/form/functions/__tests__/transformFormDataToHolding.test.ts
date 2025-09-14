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
    } as { success: true; data: typeof mockValidatedData });

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
        issues: [{ 
          message: 'Invalid holding name', 
          code: 'invalid_type' as const, 
          path: ['name'],
          expected: 'string' as const,
          received: 'undefined' as const
        }],
        format: () => ({ _errors: ['Invalid holding name'] }),
        message: 'Invalid holding name',
        isEmpty: false,
        name: 'ZodError',
        cause: undefined,
        stack: undefined,
        errors: [{ 
          message: 'Invalid holding name', 
          code: 'invalid_type' as const, 
          path: ['name'],
          expected: 'string' as const,
          received: 'undefined' as const
        }],
        addIssue: jest.fn(),
        addIssues: jest.fn(),
        flatten: jest.fn(() => ({ fieldErrors: {}, formErrors: ['Invalid holding name'] })),
        formErrors: { formErrors: ['Invalid holding name'], fieldErrors: {} }
      }
    };

    mockGetHoldingValidationResult.mockReturnValue(mockValidationError as unknown as ReturnType<typeof getHoldingValidationResult>);

    const result = transformFormDataToHolding(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Invalid holding name']);
  });
});
