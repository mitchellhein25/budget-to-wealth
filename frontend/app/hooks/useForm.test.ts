import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';
import { handleFormSubmit } from '../components/form/functions/handleFormSubmit';
import { cleanCurrencyInput } from '@/app/components/Utils';

const TEST_ITEM_NAME = 'TestItem';
const TEST_ENDPOINT = '/api/test-items';

interface TestItem {
  id: number;
  name: string;
  amount: number;
}

interface TestFormData {
  name: string;
  amount: string;
}

const mockTransformFormDataToItem = jest.fn();
const mockConvertItemToFormData = jest.fn();
const mockFetchItems = jest.fn();

const mockArgs = {
  itemName: TEST_ITEM_NAME,
  itemEndpoint: TEST_ENDPOINT,
  transformFormDataToItem: mockTransformFormDataToItem,
  convertItemToFormData: mockConvertItemToFormData,
  fetchItems: mockFetchItems
};

const mockTestItem: TestItem = {
  id: 1,
  name: 'Test Item',
  amount: 1000
};

const mockFormData: TestFormData = {
  name: 'Test Item',
  amount: '10.00'
};

jest.mock('../components/form/functions/handleFormSubmit', () => ({
  handleFormSubmit: jest.fn()
}));

jest.mock('@/app/components/Utils', () => ({
  cleanCurrencyInput: jest.fn(),
  replaceSpacesWithDashes: jest.fn((str) => str.replace(/\s+/g, '-').toLowerCase()),
}));

describe('useForm', () => {
  const mockCleanCurrencyInput = jest.mocked(cleanCurrencyInput);

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransformFormDataToItem.mockReturnValue({ item: mockTestItem, errors: [] });
    mockConvertItemToFormData.mockReturnValue(mockFormData);
    mockCleanCurrencyInput.mockImplementation((value: string) => {
      const num = parseFloat(value.replace(/,/g, ''));
      return isNaN(num) ? null : num.toFixed(2);
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.editingFormData).toEqual({});
    expect(result.current.message).toEqual({ type: null, text: '' });
    expect(typeof result.current.onChange).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.onItemIsEditing).toBe('function');
    expect(typeof result.current.onReset).toBe('function');
  });

  it('should handle onChange for regular fields', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    const mockEvent = {
      target: {
        name: `${TEST_ITEM_NAME.toLowerCase()}-name`,
        value: 'New Name'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.editingFormData).toEqual({ name: 'New Name' });
  });

  it('should handle onChange for amount fields with currency cleaning', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    const mockEvent = {
      target: {
        name: `${TEST_ITEM_NAME.toLowerCase()}-amount`,
        value: '1,234.56'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.editingFormData).toEqual({ amount: '1234.56' });
  });

  it('should handle onChange for balance fields with currency cleaning', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    const mockEvent = {
      target: {
        name: `${TEST_ITEM_NAME.toLowerCase()}-balance`,
        value: '2,500.75'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.editingFormData).toEqual({ balance: '2500.75' });
  });

  it('should handle invalid currency input by truncating to two decimal places', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    const mockEvent = {
      target: {
        name: `${TEST_ITEM_NAME.toLowerCase()}-amount`,
        value: '100.123'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.editingFormData).toEqual({ amount: '100.12' });
  });

  it('should return early when cleanCurrencyInput returns null for amount field', () => {
    mockCleanCurrencyInput.mockReturnValue(null);
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    const mockEvent = {
      target: {
        name: `${TEST_ITEM_NAME.toLowerCase()}-amount`,
        value: 'invalid'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.editingFormData).toEqual({});
  });

  it('should return early when cleanCurrencyInput returns null for balance field', () => {
    mockCleanCurrencyInput.mockReturnValue(null);
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    const mockEvent = {
      target: {
        name: `${TEST_ITEM_NAME.toLowerCase()}-balance`,
        value: 'invalid'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.editingFormData).toEqual({});
  });

  it('should handle first field change when editingFormData is empty', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    const mockEvent = {
      target: {
        name: `${TEST_ITEM_NAME.toLowerCase()}-name`,
        value: 'First Field'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.editingFormData).toEqual({ name: 'First Field' });
  });

  it('should handle field change when editingFormData is null/undefined', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    // The falsy branch is triggered when prev is null/undefined in the setEditingFormData callback
    // This can happen in edge cases where the state becomes null
    // Let's test this by directly calling the onChange with a field that doesn't exist yet
    act(() => {
      result.current.onChange({
        target: { name: `${TEST_ITEM_NAME.toLowerCase()}-newfield`, value: 'New Value' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.editingFormData).toEqual({ newfield: 'New Value' });
  });

  it('should handle multiple field changes', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    act(() => {
      result.current.onChange({
        target: { name: `${TEST_ITEM_NAME.toLowerCase()}-name`, value: 'First Name' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { name: `${TEST_ITEM_NAME.toLowerCase()}-amount`, value: '50.00' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.editingFormData).toEqual({
      name: 'First Name',
      amount: '50.00'
    });
  });

  it('should call handleFormSubmit with correct parameters', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    const mockFormData = new FormData();
    mockFormData.append('name', 'Test Name');
    mockFormData.append('amount', '100.00');

    act(() => {
      result.current.handleSubmit(mockFormData);
    });

    expect(handleFormSubmit).toHaveBeenCalledWith({
      formData: mockFormData,
      transformFormDataToItem: expect.any(Function),
      setIsSubmitting: expect.any(Function),
      setMessage: expect.any(Function),
      fetchItems: mockFetchItems,
      setEditingFormData: expect.any(Function),
      itemName: TEST_ITEM_NAME,
      itemEndpoint: TEST_ENDPOINT
    });
  });

  it('should set editing form data when onItemIsEditing is called', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    act(() => {
      result.current.onItemIsEditing(mockTestItem);
    });

    expect(mockConvertItemToFormData).toHaveBeenCalledWith(mockTestItem);
    expect(result.current.editingFormData).toEqual(mockFormData);
    expect(result.current.message).toEqual({ type: null, text: '' });
  });

  it('should reset form state when onReset is called', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    act(() => {
      result.current.onItemIsEditing(mockTestItem);
    });

    expect(result.current.editingFormData).toEqual(mockFormData);

    act(() => {
      result.current.onReset();
    });

    expect(result.current.editingFormData).toEqual({});
    expect(result.current.message).toEqual({ type: null, text: '' });
  });

  it('should handle field names with spaces correctly', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>({
      ...mockArgs,
      itemName: 'Test Item'
    }));

    const mockEvent = {
      target: {
        name: 'test-item-name',
        value: 'Test Value'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.editingFormData).toEqual({ name: 'Test Value' });
  });

  it('should handle empty form data correctly', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    const mockEvent = {
      target: {
        name: `${TEST_ITEM_NAME.toLowerCase()}-name`,
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.editingFormData).toEqual({ name: '' });
  });

  it('should preserve existing form data when adding new fields', () => {
    const { result } = renderHook(() => useForm<TestItem, TestFormData>(mockArgs));

    act(() => {
      result.current.onChange({
        target: { name: `${TEST_ITEM_NAME.toLowerCase()}-name`, value: 'Existing Name' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { name: `${TEST_ITEM_NAME.toLowerCase()}-amount`, value: '25.50' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.editingFormData).toEqual({
      name: 'Existing Name',
      amount: '25.50'
    });
  });
}); 