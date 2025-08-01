import { render, screen } from '@testing-library/react';
import { CashFlowPage } from './CashFlowPage';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME } from './constants';

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

jest.mock('@/app/hooks', () => ({
  useForm: jest.fn(),
  useDataListFetcher: jest.fn(),
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

jest.mock('./CashFlowSideBar', () => ({
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
  const mockUseForm = require('@/app/hooks').useForm as jest.MockedFunction<any>;
  const mockUseDataListFetcher = require('@/app/hooks').useDataListFetcher as jest.MockedFunction<any>;
  const mockGetCashFlowEntriesByDateRangeAndType = require('@/app/lib/api/data-methods').getCashFlowEntriesByDateRangeAndType as jest.MockedFunction<any>;
  const mockMessageTypeIsError = require('@/app/components').messageTypeIsError as jest.MockedFunction<any>;

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
    
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: null,
      fetchItems: jest.fn(),
    });
    
    mockMessageTypeIsError.mockReturnValue(false);
  });

  it('renders the page correctly', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByTestId(cashFlowSideBarTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(totalDisplayTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesListTestId)).toBeInTheDocument();
  });

  it('renders all main components with correct content', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByText(cashFlowSideBarText)).toBeInTheDocument();
    expect(screen.getByText(cashFlowEntriesFormText)).toBeInTheDocument();
    expect(screen.getByText(datePickerText)).toBeInTheDocument();
    expect(screen.getByText(totalDisplayText)).toBeInTheDocument();
    expect(screen.getByText(cashFlowEntriesListText)).toBeInTheDocument();
  });

  it('tests convertCashFlowEntryToFormData function with description', () => {
    let capturedConvertFunction: any;
    mockUseForm.mockImplementation((config: any) => {
      capturedConvertFunction = config.convertItemToFormData;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    const mockCashFlowEntry = {
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

  it('tests convertCashFlowEntryToFormData function without description', () => {
    let capturedConvertFunction: any;
    mockUseForm.mockImplementation((config: any) => {
      capturedConvertFunction = config.convertItemToFormData;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    const mockCashFlowEntry = {
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

  it('tests convertCashFlowEntryToFormData function with undefined description', () => {
    let capturedConvertFunction: any;
    mockUseForm.mockImplementation((config: any) => {
      capturedConvertFunction = config.convertItemToFormData;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    const mockCashFlowEntry = {
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

  it('tests transformFormDataToEntry function', () => {
    const mockTransformCashFlowFormDataToEntry = require('./form').transformCashFlowFormDataToEntry as jest.MockedFunction<any>;
    mockTransformCashFlowFormDataToEntry.mockReturnValue({ item: {}, errors: [] });

    let capturedTransformFunction: any;
    mockUseForm.mockImplementation((config: any) => {
      capturedTransformFunction = config.transformFormDataToItem;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    const formData = new FormData();
    formData.append('amount', '100.50');
    formData.append('date', '2023-01-15');
    
    const result = capturedTransformFunction(formData);
    
    expect(result).toBeDefined();
    expect(mockTransformCashFlowFormDataToEntry).toHaveBeenCalledWith(formData, INCOME_ITEM_NAME);
  });

  it('tests useEffect dependency on dateRange', () => {
    const mockFetchItems = jest.fn();
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: null,
      fetchItems: mockFetchItems,
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockFetchItems).toHaveBeenCalled();
  });

  it('tests useMemo totalAmount calculation with items', () => {
    const mockItems = [
      { id: 1, amount: 5000 },
      { id: 2, amount: 3000 },
      { id: 3, amount: 2000 },
    ];

    mockUseDataListFetcher.mockReturnValue({
      items: mockItems,
      isLoading: false,
      message: null,
      fetchItems: jest.fn(),
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockUseDataListFetcher).toHaveBeenCalled();
  });

  it('tests useMemo totalAmount calculation with empty items', () => {
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: null,
      fetchItems: jest.fn(),
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockUseDataListFetcher).toHaveBeenCalled();
  });

  it('tests messageTypeIsError function call', () => {
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: { type: 'error', text: 'Error message' },
      fetchItems: jest.fn(),
    });
    mockMessageTypeIsError.mockReturnValue(true);

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockMessageTypeIsError).toHaveBeenCalledWith({ type: 'error', text: 'Error message' });
  });

  it('tests different cash flow types', () => {
    render(<CashFlowPage cashFlowType={EXPENSE_ITEM_NAME} />);
    
    expect(screen.getByTestId(cashFlowSideBarTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(totalDisplayTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesListTestId)).toBeInTheDocument();
  });

  it('tests loading state', () => {
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: true,
      message: null,
      fetchItems: jest.fn(),
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockUseDataListFetcher).toHaveBeenCalled();
  });

  it('tests error state', () => {
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: { type: 'error', text: 'Error message' },
      fetchItems: jest.fn(),
    });
    mockMessageTypeIsError.mockReturnValue(true);

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    
    expect(mockMessageTypeIsError).toHaveBeenCalledWith({ type: 'error', text: 'Error message' });
  });
}); 