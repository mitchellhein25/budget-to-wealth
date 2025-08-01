import { transformFormDataToHolding } from '../transformFormDataToHolding';
import { getHoldingValidationResult } from '../getHoldingValidationResult';
import { Holding } from '@/app/net-worth/holdings/components/Holding';
import { HoldingType } from '@/app/net-worth/holdings/components/HoldingType';

jest.mock('../getHoldingValidationResult');

describe('transformFormDataToHolding', () => {
  const mockGetHoldingValidationResult = jest.mocked(getHoldingValidationResult);

  const createMockFormData = (data: Record<string, string | undefined>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  const createMockZodIssue = (message: string, path: string[]) => ({
    message,
    path,
    code: 'invalid_string' as const,
    validation: 'regex' as const
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('successful transformation', () => {
    it('should transform valid form data to Holding object', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: true,
        data: {
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: '1',
          institution: 'Test Bank'
        }
      });

      const result = transformFormDataToHolding(formData);

      expect(result.item).toEqual({
        name: 'Test Holding',
        type: 'Asset' as HoldingType,
        holdingCategoryId: '1',
        institution: 'Test Bank'
      });
      expect(result.errors).toEqual([]);
    });

    it('should transform form data without institution', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Debt',
        'holding-holdingCategoryId': '2'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: true,
        data: {
          name: 'Test Holding',
          type: 'Debt',
          holdingCategoryId: '2',
          institution: undefined
        }
      });

      const result = transformFormDataToHolding(formData);

      expect(result.item).toEqual({
        name: 'Test Holding',
        type: 'Debt' as HoldingType,
        holdingCategoryId: '2',
        institution: undefined
      });
      expect(result.errors).toEqual([]);
    });

    it('should transform form data with debt type', () => {
      const formData = createMockFormData({
        'holding-name': 'Credit Card',
        'holding-type': 'Debt',
        'holding-holdingCategoryId': '3',
        'holding-institution': 'Bank of America'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: true,
        data: {
          name: 'Credit Card',
          type: 'Debt',
          holdingCategoryId: '3',
          institution: 'Bank of America'
        }
      });

      const result = transformFormDataToHolding(formData);

      expect(result.item).toEqual({
        name: 'Credit Card',
        type: 'Debt' as HoldingType,
        holdingCategoryId: '3',
        institution: 'Bank of America'
      });
      expect(result.errors).toEqual([]);
    });

    it('should transform form data with asset type', () => {
      const formData = createMockFormData({
        'holding-name': 'Stock Portfolio',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '4',
        'holding-institution': 'Fidelity'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: true,
        data: {
          name: 'Stock Portfolio',
          type: 'Asset',
          holdingCategoryId: '4',
          institution: 'Fidelity'
        }
      });

      const result = transformFormDataToHolding(formData);

      expect(result.item).toEqual({
        name: 'Stock Portfolio',
        type: 'Asset' as HoldingType,
        holdingCategoryId: '4',
        institution: 'Fidelity'
      });
      expect(result.errors).toEqual([]);
    });
  });

  describe('validation failures', () => {
    it('should return error when name is missing', () => {
      const formData = createMockFormData({
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: false,
        error: {
          errors: [
            { message: 'Name field is required.' }
          ]
        }
      } as any);

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['Name field is required.']);
    });

    it('should return error when type is missing', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-holdingCategoryId': '1'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: false,
        error: {
          errors: [
            { message: 'Type field is required.' }
          ]
        }
      } as any);

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['Type field is required.']);
    });

    it('should return error when category is missing', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: false,
        error: {
          errors: [
            { message: 'Category field is required' }
          ]
        }
      } as any);

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['Category field is required']);
    });

    it('should return first error when multiple validation errors exist', () => {
      const formData = createMockFormData({
        'holding-institution': 'Test Bank'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: false,
        error: {
          errors: [
            { message: 'Name field is required.' },
            { message: 'Type field is required.' },
            { message: 'Category field is required' }
          ]
        }
      } as any);

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['Name field is required.']);
    });

    it('should handle empty validation errors array', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: false,
        error: {
          errors: []
        }
      } as any);

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should handle unexpected errors during validation', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding'
      });

      mockGetHoldingValidationResult.mockImplementation(() => {
        throw new Error('Unexpected validation error');
      });

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['An unexpected validation error occurred.\nUnexpected validation error']);
    });

    it('should handle errors without message property', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding'
      });

      mockGetHoldingValidationResult.mockImplementation(() => {
        throw new Error();
      });

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['An unexpected validation error occurred.\n']);
    });

    it('should handle non-Error objects thrown', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding'
      });

      mockGetHoldingValidationResult.mockImplementation(() => {
        throw 'String error';
      });

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['An unexpected validation error occurred.']);
    });

    it('should handle null errors', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding'
      });

      mockGetHoldingValidationResult.mockImplementation(() => {
        throw null;
      });

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['An unexpected validation error occurred.']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty form data', () => {
      const formData = new FormData();

      mockGetHoldingValidationResult.mockReturnValue({
        success: false,
        error: {
          errors: [
            { message: 'Name field is required.' }
          ]
        }
      } as any);

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['Name field is required.']);
    });

    it('should handle form data with only optional fields', () => {
      const formData = createMockFormData({
        'holding-institution': 'Test Bank'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: false,
        error: {
          errors: [
            { message: 'Name field is required.' }
          ]
        }
      } as any);

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['Name field is required.']);
    });

    it('should handle form data with whitespace-only values', () => {
      const formData = createMockFormData({
        'holding-name': '   ',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: false,
        error: {
          errors: [
            { message: 'Name field is required.' }
          ]
        }
      } as any);

      const result = transformFormDataToHolding(formData);

      expect(result.item).toBeNull();
      expect(result.errors).toEqual(['Name field is required.']);
    });

    it('should handle form data with special characters', () => {
      const formData = createMockFormData({
        'holding-name': 'Test & Holding (Special)',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Bank & Trust Co.'
      });

      mockGetHoldingValidationResult.mockReturnValue({
        success: true,
        data: {
          name: 'Test & Holding (Special)',
          type: 'Asset',
          holdingCategoryId: '1',
          institution: 'Bank & Trust Co.'
        }
      });

      const result = transformFormDataToHolding(formData);

      expect(result.item).toEqual({
        name: 'Test & Holding (Special)',
        type: 'Asset' as HoldingType,
        holdingCategoryId: '1',
        institution: 'Bank & Trust Co.'
      });
      expect(result.errors).toEqual([]);
    });
  });
}); 