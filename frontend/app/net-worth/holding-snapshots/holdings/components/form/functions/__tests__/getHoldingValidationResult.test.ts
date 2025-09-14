import { getHoldingValidationResult } from '@/app/net-worth/holding-snapshots/holdings';

describe('getHoldingValidationResult', () => {
  const createMockFormData = (data: Record<string, string | undefined>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  describe('valid form data', () => {
    it('should return success for valid holding data', () => {
      const formData = createMockFormData({
        'holding-id': '123e4567-e89b-12d3-a456-426614174000',
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: '1',
          institution: 'Test Bank'
        });
      }
    });

    it('should return success for valid holding data without id', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Debt',
        'holding-holdingCategoryId': '2',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          id: undefined,
          name: 'Test Holding',
          type: 'Debt',
          holdingCategoryId: '2',
          institution: 'Test Bank'
        });
      }
    });

    it('should return success for valid holding data without institution', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          id: undefined,
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: '1',
          institution: ''
        });
      }
    });

    it('should trim whitespace from string fields', () => {
      const formData = createMockFormData({
        'holding-name': '  Test Holding  ',
        'holding-type': '  Asset  ',
        'holding-holdingCategoryId': '  1  ',
        'holding-institution': '  Test Bank  '
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          id: undefined,
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: '1',
          institution: 'Test Bank'
        });
      }
    });
  });

  describe('invalid form data', () => {
    it('should return error when name is missing', () => {
      const formData = createMockFormData({
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['name']);
        expect(result.error.issues[0].message).toBe('Expected string, received null');
      }
    });

    it('should return error when name is empty string', () => {
      const formData = createMockFormData({
        'holding-name': '',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['name']);
        expect(result.error.issues[0].message).toBe('Name field is required.');
      }
    });

    it('should return error when name is only whitespace', () => {
      const formData = createMockFormData({
        'holding-name': '   ',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['name']);
        expect(result.error.issues[0].message).toBe('Name field is required.');
      }
    });

    it('should return error when type is missing', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['type']);
        expect(result.error.issues[0].message).toBe('Expected string, received null');
      }
    });

    it('should return error when type is empty string', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': '',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['type']);
        expect(result.error.issues[0].message).toBe('Type field is required.');
      }
    });

    it('should return error when holdingCategoryId is missing', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['holdingCategoryId']);
        expect(result.error.issues[0].message).toBe('Category field is required');
      }
    });

    it('should return error when holdingCategoryId is empty string', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['holdingCategoryId']);
        expect(result.error.issues[0].message).toBe('Category field is required');
      }
    });

    it('should return error when holdingCategoryId is only whitespace', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '   ',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['holdingCategoryId']);
        expect(result.error.issues[0].message).toBe('Category field is required');
      }
    });

    it('should return multiple errors when multiple required fields are missing', () => {
      const formData = createMockFormData({
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(3);
        const errorPaths = result.error.issues.map(issue => issue.path[0]);
        expect(errorPaths).toContain('name');
        expect(errorPaths).toContain('type');
        expect(errorPaths).toContain('holdingCategoryId');
      }
    });
  });

  describe('id field validation', () => {
    it('should accept valid UUID for id field', () => {
      const formData = createMockFormData({
        'holding-id': '123e4567-e89b-12d3-a456-426614174000',
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      }
    });

    it('should return error for invalid UUID format', () => {
      const formData = createMockFormData({
        'holding-id': 'invalid-uuid',
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['id']);
      }
    });

    it('should handle undefined id field', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBeUndefined();
      }
    });
  });

  describe('institution field handling', () => {
    it('should handle empty institution field', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': ''
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.institution).toBe('');
      }
    });

    it('should handle missing institution field', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.institution).toBe('');
      }
    });

    it('should trim whitespace from institution field', () => {
      const formData = createMockFormData({
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': '  Test Bank  '
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.institution).toBe('Test Bank');
      }
    });
  });

  describe('form data extraction', () => {
    it('should extract form data with correct field names', () => {
      const formData = createMockFormData({
        'holding-id': '123e4567-e89b-12d3-a456-426614174000',
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: '1',
          institution: 'Test Bank'
        });
      }
    });

    it('should handle form data with extra fields', () => {
      const formData = createMockFormData({
        'holding-id': '123e4567-e89b-12d3-a456-426614174000',
        'holding-name': 'Test Holding',
        'holding-type': 'Asset',
        'holding-holdingCategoryId': '1',
        'holding-institution': 'Test Bank',
        'extra-field': 'should be ignored'
      });

      const result = getHoldingValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: '1',
          institution: 'Test Bank'
        });
      }
    });
  });
}); 