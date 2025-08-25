import { render, screen, waitFor, act } from '@testing-library/react';
import { CashFlowPage } from './CashFlowPage';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME } from './components/constants';
import { useForm, useMobileDetection } from '@/app/hooks';
import { getCashFlowEntriesByDateRangeAndType } from '@/app/lib/api/data-methods';
import { messageTypeIsError } from '@/app/components';
import { CashFlowType, CashFlowEntry } from '@/app/cashflow/components';

const cashFlowSideBarTestId = 'cash-flow-side-bar';
const cashFlowEntriesFormTestId = 'cash-flow-entries-form';
const datePickerTestId = 'date-picker';
const totalDisplayTestId = 'total-display';
const cashFlowEntriesListTestId = 'cash-flow-entries-list';

interface DatePickerProps {
  setDateRange: (range: { start: Date; end: Date }) => void;
}

interface TotalDisplayProps {
  label: string;
  amount: number;
  isLoading: boolean;
}

interface CashFlowEntriesFormProps {
  cashFlowType: string;
  formState: {
    onSubmit: () => void;
  };
}

interface CashFlowEntriesListProps {
  cashFlowType: string;
  entries: CashFlowEntry[];
  onEntryDeleted: () => void;
  isLoading: boolean;
  isError: boolean;
}

jest.mock('@/app/hooks', () => ({
  useForm: jest.fn(),
  useMobileDetection: jest.fn(),
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  getCashFlowEntriesByDateRangeAndType: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  DatePicker: ({ setDateRange }: DatePickerProps) => (
    <div data-testid={datePickerTestId}>
      <span>Date Picker</span>
      <button onClick={() => setDateRange({ start: new Date(), end: new Date() })}>
        Change Date
      </button>
    </div>
  ),
  TotalDisplay: ({ label, amount, isLoading }: TotalDisplayProps) => (
    <div data-testid={totalDisplayTestId}>
      <span>{label}</span>
      <span>{isLoading ? 'Loading...' : `$${(amount / 100).toFixed(2)}`}</span>
    </div>
  ),
  getCurrentMonthRange: jest.fn(() => ({ start: new Date('2024-01-01'), end: new Date('2024-01-31') })),
  messageTypeIsError: jest.fn(() => false),
  MESSAGE_TYPE_ERROR: 'error',
}));

jest.mock('./components/CashFlowSideBar', () => ({
  CashFlowSideBar: () => <div data-testid={cashFlowSideBarTestId}>Cash Flow Side Bar</div>,
}));

jest.mock('./form', () => ({
  CashFlowEntriesForm: ({ cashFlowType, formState }: CashFlowEntriesFormProps) => (
    <div data-testid={cashFlowEntriesFormTestId}>
      <span>Cash Flow Entries Form - {cashFlowType}</span>
      <button onClick={formState.onSubmit}>Submit</button>
    </div>
  ),
  CashFlowEntryFormData: {},
  transformCashFlowFormDataToEntry: jest.fn(),
}));

jest.mock('./list/CashFlowEntriesList', () => ({
  __esModule: true,
  default: ({ cashFlowType, entries, onEntryDeleted, isLoading, isError }: CashFlowEntriesListProps) => (
    <div data-testid={cashFlowEntriesListTestId}>
      <span>Cash Flow Entries List - {cashFlowType}</span>
      <span>Entries: {entries.length}</span>
      <span>Loading: {isLoading.toString()}</span>
      <span>Error: {isError.toString()}</span>
      <button onClick={() => onEntryDeleted()}>Refresh</button>
    </div>
  ),
}));

describe('CashFlowPage', () => {
  const mockUseForm = jest.mocked(useForm);
  const mockUseMobileDetection = jest.mocked(useMobileDetection);
  const mockGetCashFlowEntriesByDateRangeAndType = jest.mocked(getCashFlowEntriesByDateRangeAndType);
  const mockMessageTypeIsError = jest.mocked(messageTypeIsError);

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseForm.mockReturnValue({
      editingFormData: {},
      onChange: jest.fn(),
      handleSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      isSubmitting: false,
      message: { type: null, text: '' },
      onReset: jest.fn(),
    });
    
    mockUseMobileDetection.mockReturnValue(false);
    
    mockGetCashFlowEntriesByDateRangeAndType.mockResolvedValue({
      successful: true,
      data: [],
      responseMessage: '',
    });
    
    mockMessageTypeIsError.mockReturnValue(false);
  });

  it('renders all main components for desktop view', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(screen.getByTestId(cashFlowSideBarTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(totalDisplayTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesListTestId)).toBeInTheDocument();
  });

  it('renders all main components for mobile view', async () => {
    mockUseMobileDetection.mockReturnValue(true);
    
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    expect(screen.getByTestId(cashFlowEntriesFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(totalDisplayTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesListTestId)).toBeInTheDocument();
    
    expect(screen.queryByTestId(cashFlowSideBarTestId)).not.toBeInTheDocument();
  });

  it('displays correct cash flow type in components', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={EXPENSE_ITEM_NAME} />);
    });
    
    expect(screen.getByText(`Cash Flow Entries Form - ${EXPENSE_ITEM_NAME}`)).toBeInTheDocument();
    expect(screen.getByText(`Cash Flow Entries List - ${EXPENSE_ITEM_NAME}`)).toBeInTheDocument();
    expect(screen.getByText(`Total ${EXPENSE_ITEM_NAME}`)).toBeInTheDocument();
  });

  it('fetches cash flow entries on mount', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    await waitFor(() => {
      expect(mockGetCashFlowEntriesByDateRangeAndType).toHaveBeenCalled();
    });
  });

  it('handles successful API response', async () => {
    const mockEntries: CashFlowEntry[] = [
      { id: 1, amount: 5000, date: '2024-01-15', categoryId: '1', description: 'Salary', entryType: INCOME_ITEM_NAME as CashFlowType },
      { id: 2, amount: 2500, date: '2024-01-20', categoryId: '2', description: 'Bonus', entryType: INCOME_ITEM_NAME as CashFlowType }
    ];
    
    mockGetCashFlowEntriesByDateRangeAndType.mockResolvedValue({
      successful: true,
      data: mockEntries,
      responseMessage: 'Success',
    });
    
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Entries: 2')).toBeInTheDocument();
      expect(screen.getByText('$75.00')).toBeInTheDocument(); // (5000 + 2500) / 100
    });
  });

  it('handles API error response', async () => {
    mockGetCashFlowEntriesByDateRangeAndType.mockResolvedValue({
      successful: false,
      data: null,
      responseMessage: 'Failed to load entries',
    });
    
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Entries: 0')).toBeInTheDocument();
    });
  });

  it('handles API exception', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetCashFlowEntriesByDateRangeAndType.mockRejectedValue(new Error('Network error'));
    
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Fetch error:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  it('calculates total amount correctly', async () => {
    const mockEntries: CashFlowEntry[] = [
      { id: 1, amount: 1000, date: '2024-01-15', categoryId: '1', description: 'Small amount', entryType: INCOME_ITEM_NAME as CashFlowType },
      { id: 2, amount: 2000, date: '2024-01-20', categoryId: '2', description: 'Medium amount', entryType: INCOME_ITEM_NAME as CashFlowType },
      { id: 3, amount: 3000, date: '2024-01-25', categoryId: '3', description: 'Large amount', entryType: INCOME_ITEM_NAME as CashFlowType }
    ];
    
    mockGetCashFlowEntriesByDateRangeAndType.mockResolvedValue({
      successful: true,
      data: mockEntries,
      responseMessage: 'Success',
    });
    
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('$60.00')).toBeInTheDocument(); // (1000 + 2000 + 3000) / 100
    });
  });

  it('handles empty entries array', async () => {
    mockGetCashFlowEntriesByDateRangeAndType.mockResolvedValue({
      successful: true,
      data: [],
      responseMessage: 'Success',
    });
    
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Entries: 0')).toBeInTheDocument();
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
  });

  it('calls messageTypeIsError with message state', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    await waitFor(() => {
      expect(mockMessageTypeIsError).toHaveBeenCalledWith({ type: null, text: '' });
    });
  });

  it('refreshes entries when refresh button is clicked', async () => {
    await act(async () => {
      render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    });
    
    const refreshButton = screen.getByText('Refresh');
    await act(async () => {
      refreshButton.click();
    });
    
    await waitFor(() => {
      expect(mockGetCashFlowEntriesByDateRangeAndType).toHaveBeenCalledTimes(2);
    });
  });
});
