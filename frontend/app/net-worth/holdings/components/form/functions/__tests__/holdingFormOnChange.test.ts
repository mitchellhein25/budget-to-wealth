import { holdingFormOnChange } from '../holdingFormOnChange';
import { HoldingFormData } from '../../HoldingFormData';

describe('holdingFormOnChange', () => {
  const createMockEvent = (name: string, value: string): React.ChangeEvent<HTMLInputElement> => ({
    target: {
      name,
      value,
    },
  } as React.ChangeEvent<HTMLInputElement>);

  const createMockSetEditingFormData = () => {
    const mockSetState = jest.fn();
    return mockSetState;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('field name extraction', () => {
    it('should extract field name by removing holding- prefix', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-name', 'Test Holding');

      holdingFormOnChange(event, mockSetState);

      expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ name: 'Test Holding' });
    });

    it('should handle field names with different prefixes', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-type', 'Asset');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ type: 'Asset' });
    });

    it('should handle field names with complex prefixes', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-holdingCategoryId', '123');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ holdingCategoryId: '123' });
    });

    it('should handle field names with institution prefix', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-institution', 'Test Bank');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ institution: 'Test Bank' });
    });
  });

  describe('state updates', () => {
    it('should update state with new value while preserving existing state', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-name', 'New Holding Name');
      const existingState: Partial<HoldingFormData> = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'Asset',
        holdingCategoryId: '1',
        institution: 'Test Bank'
      };

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback(existingState);
      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'New Holding Name',
        type: 'Asset',
        holdingCategoryId: '1',
        institution: 'Test Bank'
      });
    });

    it('should update state when no existing state is present', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-type', 'Debt');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ type: 'Debt' });
    });

    it('should update state when existing state is undefined', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-institution', 'New Bank');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback(undefined as any);
      expect(result).toEqual({ institution: 'New Bank' });
    });

    it('should update state when existing state is null', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-name', 'Test Name');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback(null as any);
      expect(result).toEqual({ name: 'Test Name' });
    });
  });

  describe('different field types', () => {
    it('should handle string values', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-name', 'String Value');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ name: 'String Value' });
    });

    it('should handle empty string values', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-institution', '');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ institution: '' });
    });

    it('should handle numeric string values', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-holdingCategoryId', '123');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ holdingCategoryId: '123' });
    });

    it('should handle UUID string values', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-id', '123e4567-e89b-12d3-a456-426614174000');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000' });
    });

    it('should handle whitespace values', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-name', '   Test Name   ');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ name: '   Test Name   ' });
    });
  });

  describe('multiple state updates', () => {
    it('should accumulate multiple field updates', () => {
      const mockSetState = createMockSetEditingFormData();
      const existingState: Partial<HoldingFormData> = {
        name: 'Original Name',
        type: 'Asset'
      };

      // First update
      const event1 = createMockEvent('holding-name', 'Updated Name');
      holdingFormOnChange(event1, mockSetState);

      const setStateCallback1 = mockSetState.mock.calls[0][0];
      const result1 = setStateCallback1(existingState);

      // Second update
      const event2 = createMockEvent('holding-type', 'Debt');
      holdingFormOnChange(event2, mockSetState);

      const setStateCallback2 = mockSetState.mock.calls[1][0];
      const result2 = setStateCallback2(result1);

      expect(result1).toEqual({
        name: 'Updated Name',
        type: 'Asset'
      });
      expect(result2).toEqual({
        name: 'Updated Name',
        type: 'Debt'
      });
    });

    it('should handle multiple updates to the same field', () => {
      const mockSetState = createMockSetEditingFormData();
      const existingState: Partial<HoldingFormData> = {
        name: 'Original Name'
      };

      // First update
      const event1 = createMockEvent('holding-name', 'First Update');
      holdingFormOnChange(event1, mockSetState);

      const setStateCallback1 = mockSetState.mock.calls[0][0];
      const result1 = setStateCallback1(existingState);

      // Second update to same field
      const event2 = createMockEvent('holding-name', 'Second Update');
      holdingFormOnChange(event2, mockSetState);

      const setStateCallback2 = mockSetState.mock.calls[1][0];
      const result2 = setStateCallback2(result1);

      expect(result1).toEqual({ name: 'First Update' });
      expect(result2).toEqual({ name: 'Second Update' });
    });
  });

  describe('edge cases', () => {
    it('should handle field names without holding- prefix', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('name', 'Test Value');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ name: 'Test Value' });
    });

    it('should handle field names with multiple holding- prefixes', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-holding-name', 'Test Value');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ 'holding-name': 'Test Value' });
    });

    it('should handle empty field names', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('', 'Test Value');

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ '': 'Test Value' });
    });

    it('should handle undefined values', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-name', undefined as any);

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ name: undefined });
    });

    it('should handle null values', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-name', null as any);

      holdingFormOnChange(event, mockSetState);

      const setStateCallback = mockSetState.mock.calls[0][0];
      const result = setStateCallback({});
      expect(result).toEqual({ name: null });
    });
  });

  describe('function behavior', () => {
    it('should call setEditingFormData with a function', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-name', 'Test Value');

      holdingFormOnChange(event, mockSetState);

      expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should not call setEditingFormData multiple times for single event', () => {
      const mockSetState = createMockSetEditingFormData();
      const event = createMockEvent('holding-name', 'Test Value');

      holdingFormOnChange(event, mockSetState);

      expect(mockSetState).toHaveBeenCalledTimes(1);
    });

    it('should handle all HoldingFormData fields', () => {
      const mockSetState = createMockSetEditingFormData();
      const fields: Array<keyof HoldingFormData> = ['id', 'name', 'type', 'holdingCategoryId', 'institution'];

      fields.forEach((field, index) => {
        const event = createMockEvent(`holding-${field}`, `value-${index}`);
        holdingFormOnChange(event, mockSetState);

        const setStateCallback = mockSetState.mock.calls[index][0];
        const result = setStateCallback({});
        expect(result).toEqual({ [field]: `value-${index}` });
      });
    });
  });
}); 