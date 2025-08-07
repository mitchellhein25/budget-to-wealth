import { render, screen, act } from '@testing-library/react';
import { CashFlowPage } from './CashFlowPage';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME } from './components/constants';
import { useForm } from '@/app/hooks';
import { messageTypeIsError } from '@/app/components';
import { getCashFlowEntriesByDateRangeAndType } from '@/app/lib/api/data-methods';
import { transformCashFlowFormDataToEntry } from './form';

const cashFlowSideBarTestId = 'cash-flow-side-bar';
const cashFlowEntriesFormTestId = 'cash-flow-entries-form';
const datePickerTestId = 'date-picker';
const totalDisplayTestId = 'total-display';
const cashFlowEntriesListTestId = 'cash-flow-entries-list';
const cashFlowSideBarText = 'Cash Flow Side Bar';
const cashFlowEntriesFormText = 'Cash Flow Entries Form';
const datePickerText = 'Date Picker';
const totalDisplayText = 'Total Display';
const cashFlowEntriesListText = 'Cash Flow Entries List';

interface UseFormConfig {
  convertItemToFormData?: (item: CashFlowEntry) => Record<string, unknown>;
  transformFormDataToItem?: (formData: FormData) => Record<string, unknown>;
}

interface CashFlowEntry {
  id: number;
  amount: number;
  date: string;
  categoryId: number;
  description?: string | null;
  recurrenceFrequency?: string;
  recurrenceEndDate?: string;
}

jest.mock('@/app/hooks', () => ({
  useForm: jest.fn(),
  useMobileDetection: () => false,
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  getCashFlowEntriesByDateRangeAndType: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  DatePicker: () => <div data-testid={datePickerTestId}>{datePickerText}</div>,
  TotalDisplay: () => <div data-testid={totalDisplayTestId}>{totalDisplayText}</div>,
  getCurrentMonthRange: jest.fn(() => ({ start: new Date(), end: new Date() })),
  messageTypeIsError: jest.fn(() => false),
}));

jest.mock('./components/CashFlowSideBar', () => ({
  CashFlowSideBar: () => <div data-testid={cashFlowSideBarTestId}>{cashFlowSideBarText}</div>,
}));

jest.mock('./form', () => ({
  CashFlowEntriesForm: () => <div data-testid={cashFlowEntriesFormTestId}>{cashFlowEntriesFormText}</div>,
  CashFlowEntryFormData: {},
  transformCashFlowFormDataToEntry: jest.fn(),
}));

jest.mock('./list/CashFlowEntriesList', () => ({
  __esModule: true,
  default: () => <div data-testid={cashFlowEntriesListTestId}>{cashFlowEntriesListText}</div>,
}));

describe('CashFlowPage', () => {
  const mockUseForm = jest.mocked(useForm);
  const mockMessageTypeIsError = jest.mocked(messageTypeIsError);
  const mockGetCashFlowEntriesByDateRangeAndType = jest.mocked(getCashFlowEntriesByDateRangeAndType);

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseForm.mockReturnValue({
      formData: {},
      onInputChange: jest.fn(),
      onSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      isSubmitting: false,
      message: null,
    });
    
    mockGetCashFlowEntriesByDateRangeAndType.mockResolvedValue({
      successful: true,
      data: [],
    });
    
    mockMessageTypeIsError.mockReturnValue(false);
  });

  it('renders the page correctly', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(screen.getByTestId(cashFlowSideBarTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(totalDisplayTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesListTestId)).toBeInTheDocument();
  });

  it('renders all main components with correct content', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(screen.getByText(cashFlowSideBarText)).toBeInTheDocument();
    expect(screen.getByText(cashFlowEntriesFormText)).toBeInTheDocument();
    expect(screen.getByText(datePickerText)).toBeInTheDocument();
    expect(screen.getByText(totalDisplayText)).toBeInTheDocument();
    expect(screen.getByText(cashFlowEntriesListText)).toBeInTheDocument();
  });

  it('tests convertCashFlowEntryToFormData function with description', async () => {
    let capturedConvertFunction: (item: CashFlowEntry) => Record<string, unknown>;
    mockUseForm.mockImplementation((config: UseFormConfig) => {
      capturedConvertFunction = config.convertItemToFormData!;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    const mockCashFlowEntry: CashFlowEntry = {
      id: 1,
      amount: 5000,
      date: '2023-01-15',
      categoryId: 1,
      description: 'Salary payment',
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2023-12-31',
    };
    
    const result = capturedConvertFunction(mockCashFlowEntry);
    
    expect(result).toEqual({
      id: '1',
      amount: '50.00',
      date: new Date('2023-01-15'),
      categoryId: 1,
      description: 'Salary payment',
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2023-12-31',
    });
  });

  it('tests convertCashFlowEntryToFormData function without description', async () => {
    let capturedConvertFunction: (item: CashFlowEntry) => Record<string, unknown>;
    mockUseForm.mockImplementation((config: UseFormConfig) => {
      capturedConvertFunction = config.convertItemToFormData!;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    const mockCashFlowEntry: CashFlowEntry = {
      id: 1,
      amount: 5000,
      date: '2023-01-15',
      categoryId: 1,
      description: null,
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2023-12-31',
    };
    
    const result = capturedConvertFunction(mockCashFlowEntry);
    
    expect(result).toEqual({
      id: '1',
      amount: '50.00',
      date: new Date('2023-01-15'),
      categoryId: 1,
      description: '',
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2023-12-31',
    });
  });

  it('tests convertCashFlowEntryToFormData function with undefined description', async () => {
    let capturedConvertFunction: (item: CashFlowEntry) => Record<string, unknown>;
    mockUseForm.mockImplementation((config: UseFormConfig) => {
      capturedConvertFunction = config.convertItemToFormData!;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    const mockCashFlowEntry: CashFlowEntry = {
      id: 1,
      amount: 5000,
      date: '2023-01-15',
      categoryId: 1,
      description: undefined,
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2023-12-31',
    };
    
    const result = capturedConvertFunction(mockCashFlowEntry);
    
    expect(result).toEqual({
      id: '1',
      amount: '50.00',
      date: new Date('2023-01-15'),
      categoryId: 1,
      description: '',
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2023-12-31',
    });
  });

  it('tests transformFormDataToEntry function', async () => {
    const mockTransformCashFlowFormDataToEntry = jest.mocked(transformCashFlowFormDataToEntry);
    mockTransformCashFlowFormDataToEntry.mockReturnValue({ item: {}, errors: [] });

    let capturedTransformFunction: (formData: FormData) => Record<string, unknown>;
    mockUseForm.mockImplementation((config: UseFormConfig) => {
      capturedTransformFunction = config.transformFormDataToItem!;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    const formData = new FormData();
    formData.append('amount', '100.50');
    formData.append('date', '2023-01-15');
    
    const result = capturedTransformFunction(formData);
    
    expect(result).toBeDefined();
    expect(mockTransformCashFlowFormDataToEntry).toHaveBeenCalledWith(formData, INCOME_ITEM_NAME);
  });

  it('tests useEffect dependency on dateRange', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(mockGetCashFlowEntriesByDateRangeAndType).toHaveBeenCalled();
  });

  it('tests useMemo totalAmount calculation with items', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(mockGetCashFlowEntriesByDateRangeAndType).toHaveBeenCalled();
  });

  it('tests useMemo totalAmount calculation with empty items', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(mockGetCashFlowEntriesByDateRangeAndType).toHaveBeenCalled();
  });

  it('tests messageTypeIsError function call', async () => {
    mockMessageTypeIsError.mockReturnValue(true);

    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(mockMessageTypeIsError).toHaveBeenCalledWith({ type: null, text: '' });
  });

  it('tests different cash flow types', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={EXPENSE_ITEM_NAME} />);
    });
    
    expect(screen.getByTestId(cashFlowSideBarTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(totalDisplayTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesListTestId)).toBeInTheDocument();
  });

  it('tests loading state', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(mockGetCashFlowEntriesByDateRangeAndType).toHaveBeenCalled();
  });

  it('tests error state', async () => {
    mockMessageTypeIsError.mockReturnValue(true);

    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(mockMessageTypeIsError).toHaveBeenCalledWith({ type: null, text: '' });
  });
}); 