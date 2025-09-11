import { render, screen } from '@testing-library/react';
import { CashFlowPage } from '@/app/cashflow/CashFlowPage';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME } from '@/app/cashflow/components/constants';
import { useForm, useMobileDetection, useFormListItemsFetch, useSidebarDetection } from '@/app/hooks';
import { messageTypeIsError } from '@/app/lib/utils';

jest.mock('@/app/hooks', () => ({
  useForm: jest.fn(),
  useMobileDetection: jest.fn(),
  useFormListItemsFetch: jest.fn(),
  useSidebarDetection: jest.fn(),
}));

jest.mock('@/app/lib/api', () => ({
  getCashFlowEntriesByDateRangeAndType: jest.fn(),
  getRecurringCashFlowEntries: jest.fn(),
}));

jest.mock('@/app/lib/utils', () => ({
  getCurrentMonthRange: jest.fn(() => ({ from: new Date('2024-01-01'), to: new Date('2024-01-31') })),
  messageTypeIsError: jest.fn(() => false),
}));

jest.mock('@/app/components', () => ({
  DatePicker: () => (
    <div data-testid="date-picker">
      <span>Date Picker</span>
    </div>
  ),
  TotalDisplay: ({ label, amount, isLoading }: { label: string; amount: number; isLoading: boolean }) => (
    <div data-testid="total-display">
      <span>{label}</span>
      <span>{isLoading ? 'Loading...' : `$${(amount / 100).toFixed(2)}`}</span>
    </div>
  ),
  ResponsiveFormListPage: ({ sideBar, totalDisplay, datePicker, form, list, showTotalAndDatePicker }: { sideBar: React.ReactNode; totalDisplay: React.ReactNode; datePicker: React.ReactNode; form: React.ReactNode; list: React.ReactNode; showTotalAndDatePicker?: boolean }) => {
    const mockUseSidebarDetection = jest.mocked(useSidebarDetection);
    const showSidebar = mockUseSidebarDetection();
    
    return (
      <div data-testid="responsive-form-list-page">
        {showSidebar && <div data-testid="sidebar">{sideBar}</div>}
        {showTotalAndDatePicker !== false && <div data-testid="responsive-total-display">{totalDisplay}</div>}
        {showTotalAndDatePicker !== false && <div data-testid="responsive-date-picker">{datePicker}</div>}
        <div data-testid="form">{form}</div>
        <div data-testid="list">{list}</div>
      </div>
    );
  },
}));

jest.mock('@/app/cashflow', () => ({
  CashFlowSideBar: () => <div data-testid="cash-flow-side-bar">Cash Flow Side Bar</div>,
  CashFlowEntriesForm: ({ cashFlowType }: { cashFlowType: string }) => (
    <div data-testid="cash-flow-entries-form">
      <span>Cash Flow Entries Form - {cashFlowType}</span>
    </div>
  ),
  CashFlowEntriesList: ({ cashFlowType, entries, onEntryDeleted, isLoading, isError, recurringOnly }: { cashFlowType: string; entries: unknown[]; onEntryDeleted: () => void; isLoading: boolean; isError: boolean; recurringOnly?: boolean }) => (
    <div data-testid="cash-flow-entries-list">
      <span>Cash Flow Entries List - {cashFlowType}</span>
      <span>Entries: {entries.length}</span>
      <span>Loading: {isLoading.toString()}</span>
      <span>Error: {isError.toString()}</span>
      <span>Recurring: {recurringOnly?.toString() || 'false'}</span>
      <button onClick={() => onEntryDeleted()}>Refresh</button>
    </div>
  ),
  CashFlowEntryFormData: {},
  transformCashFlowFormDataToEntry: jest.fn(),
  convertCashFlowEntryToFormData: jest.fn(),
}));

describe('CashFlowPage', () => {
  const mockUseForm = jest.mocked(useForm);
  const mockUseMobileDetection = jest.mocked(useMobileDetection);
  const mockUseFormListItemsFetch = jest.mocked(useFormListItemsFetch);
  const mockUseSidebarDetection = jest.mocked(useSidebarDetection);

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
    
    mockUseMobileDetection.mockReturnValue('large');
    mockUseSidebarDetection.mockReturnValue(true);
    
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: false,
      message: { type: null, text: '' },
    });
  });

  it('renders all main components for desktop view', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByTestId('cash-flow-side-bar')).toBeInTheDocument();
    expect(screen.getByTestId('cash-flow-entries-form')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-total-display')).toBeInTheDocument();
    expect(screen.getByTestId('cash-flow-entries-list')).toBeInTheDocument();
  });

  it('renders all main components for mobile view', () => {
    mockUseMobileDetection.mockReturnValue('small');
    mockUseSidebarDetection.mockReturnValue(false);
    
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByTestId('cash-flow-entries-form')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-total-display')).toBeInTheDocument();
    expect(screen.getByTestId('cash-flow-entries-list')).toBeInTheDocument();
    
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('displays correct cash flow type in components', () => {
    render(<CashFlowPage cashFlowType={EXPENSE_ITEM_NAME} />);
    
    expect(screen.getByText(`Cash Flow Entries Form - ${EXPENSE_ITEM_NAME}`)).toBeInTheDocument();
    expect(screen.getByText(`Cash Flow Entries List - ${EXPENSE_ITEM_NAME}`)).toBeInTheDocument();
    expect(screen.getByText(`Total ${EXPENSE_ITEM_NAME}`)).toBeInTheDocument();
  });

  it('fetches cash flow entries on mount', () => {
    const mockFetchItems = jest.fn();
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: mockFetchItems,
      isPending: false,
      message: { type: null, text: '' },
    });
    
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockFetchItems).toHaveBeenCalled();
  });

  it('handles API error response', () => {
    const mockMessageTypeIsError = jest.mocked(messageTypeIsError);
    mockMessageTypeIsError.mockReturnValue(true);
    
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: false,
      message: { type: 'error', text: 'Failed to load entries' },
    });
    
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByText('Error: true')).toBeInTheDocument();
  });

  it('calls messageTypeIsError with message state', () => {
    const mockMessageTypeIsError = jest.mocked(messageTypeIsError);
    
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockMessageTypeIsError).toHaveBeenCalledWith({ type: null, text: '' });
  });

  it('handles recurring only mode', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} recurringOnly={true} />);
    
    expect(screen.getByText('Recurring: true')).toBeInTheDocument();
    expect(screen.queryByTestId('responsive-total-display')).not.toBeInTheDocument();
    expect(screen.queryByTestId('responsive-date-picker')).not.toBeInTheDocument();
  });
});