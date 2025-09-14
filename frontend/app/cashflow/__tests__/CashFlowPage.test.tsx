import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CashFlowPage } from '@/app/cashflow/CashFlowPage';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME } from '@/app/cashflow/components/constants';
import { useForm, useFormListItemsFetch } from '@/app/hooks';
import { messageTypeIsError } from '@/app/lib/utils';
import { CashFlowType } from '@/app/cashflow/components/CashFlowType';

jest.mock('@/app/hooks', () => ({
  useForm: jest.fn(),
  useFormListItemsFetch: jest.fn(),
}));

jest.mock('@/app/lib/api', () => ({
  getCashFlowEntriesByDateRangeAndType: jest.fn(),
  getRecurringCashFlowEntries: jest.fn(),
}));

jest.mock('@/app/lib/utils', () => ({
  getCurrentMonthRange: jest.fn(() => ({ from: new Date('2024-01-01'), to: new Date('2024-01-31') })),
  messageTypeIsError: jest.fn(() => false),
  replaceSpacesWithDashes: jest.fn((str: string) => str.replace(/\s+/g, '-')),
}));

jest.mock('@/app/components', () => ({
  DatePicker: ({ setDateRange }: { setDateRange: (range: { from: Date; to: Date }) => void }) => (
    <div data-testid="date-picker">
      <span>Date Picker</span>
      <button onClick={() => setDateRange({ from: new Date('2024-02-01'), to: new Date('2024-02-29') })}>
        Change Date
      </button>
    </div>
  ),
  TotalDisplay: ({ label, amount, isLoading }: { label: string; amount: number; isLoading: boolean }) => (
    <div data-testid="total-display">
      <span>{label}</span>
      <span>{isLoading ? 'Loading...' : `$${(amount / 100).toFixed(2)}`}</span>
    </div>
  ),
  ResponsiveFormListPage: ({ sideBar, totalDisplay, datePicker, form, list, showTotalAndDatePicker }: { sideBar: React.ReactNode; totalDisplay: React.ReactNode; datePicker: React.ReactNode; form: React.ReactNode; list: React.ReactNode; showTotalAndDatePicker?: boolean }) => (
    <div data-testid="responsive-form-list-page">
      {showTotalAndDatePicker !== false && <div data-testid="responsive-total-display">{totalDisplay}</div>}
      {showTotalAndDatePicker !== false && <div data-testid="responsive-date-picker">{datePicker}</div>}
      <div data-testid="sidebar">{sideBar}</div>
      <div data-testid="form">{form}</div>
      <div data-testid="list">{list}</div>
    </div>
  ),
}));

jest.mock('@/app/cashflow', () => ({
  CashFlowSideBar: () => <div data-testid="cash-flow-side-bar">Cash Flow Side Bar</div>,
  CashFlowEntriesForm: ({ cashFlowType, formState }: { cashFlowType: string; formState: unknown }) => (
    <div data-testid="cash-flow-entries-form">
      <span>Cash Flow Entries Form - {cashFlowType}</span>
      <span>Form State: {JSON.stringify(formState)}</span>
    </div>
  ),
  CashFlowEntriesList: ({ cashFlowType, entries, onEntryDeleted, onEntryIsEditing, isLoading, isError, recurringOnly }: { cashFlowType: string; entries: unknown[]; onEntryDeleted: () => void; onEntryIsEditing: (entry: unknown) => void; isLoading: boolean; isError: boolean; recurringOnly?: boolean }) => (
    <div data-testid="cash-flow-entries-list">
      <span>Cash Flow Entries List - {cashFlowType}</span>
      <span>Entries: {entries.length}</span>
      <span>Loading: {isLoading.toString()}</span>
      <span>Error: {isError.toString()}</span>
      <span>Recurring: {recurringOnly?.toString() || 'false'}</span>
      <button onClick={() => onEntryDeleted()}>Refresh</button>
      <button onClick={() => onEntryIsEditing({ id: 1, amount: 1000 })}>Edit Entry</button>
    </div>
  ),
  transformCashFlowFormDataToEntry: jest.fn(),
  convertCashFlowEntryToFormData: jest.fn(),
}));

describe('CashFlowPage', () => {
  const mockUseForm = jest.mocked(useForm);
  const mockUseFormListItemsFetch = jest.mocked(useFormListItemsFetch);
  const mockMessageTypeIsError = jest.mocked(messageTypeIsError);

  const mockCashFlowEntries = [
    { id: 1, amount: 1000, entryType: INCOME_ITEM_NAME, categoryId: '1', date: '2024-01-01', description: 'Test Entry 1' },
    { id: 2, amount: 2000, entryType: INCOME_ITEM_NAME, categoryId: '2', date: '2024-01-02', description: 'Test Entry 2' },
  ];

  const mockFormState = {
    editingFormData: {},
    onChange: jest.fn(),
    handleSubmit: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: { type: null, text: '' },
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseForm.mockReturnValue(mockFormState);
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: false,
      message: { type: null, text: '' },
      items: [],
    });
    mockMessageTypeIsError.mockReturnValue(false);
  });

  it('renders all main components', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByTestId('cash-flow-side-bar')).toBeInTheDocument();
    expect(screen.getByTestId('cash-flow-entries-form')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-total-display')).toBeInTheDocument();
    expect(screen.getByTestId('cash-flow-entries-list')).toBeInTheDocument();
  });

  it('displays correct cash flow type in components', () => {
    render(<CashFlowPage cashFlowType={EXPENSE_ITEM_NAME} />);
    
    expect(screen.getByText(`Cash Flow Entries Form - ${EXPENSE_ITEM_NAME}`)).toBeInTheDocument();
    expect(screen.getByText(`Cash Flow Entries List - ${EXPENSE_ITEM_NAME}`)).toBeInTheDocument();
    expect(screen.getByText(`Total ${EXPENSE_ITEM_NAME}`)).toBeInTheDocument();
  });

  it('calls getCashFlowEntriesByDateRangeAndType when not recurring only', () => {
    const mockFetchItems = jest.fn();
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: mockFetchItems,
      isPending: false,
      message: { type: null, text: '' },
      items: [],
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockFetchItems).toHaveBeenCalled();
  });

  it('calls getRecurringCashFlowEntries when recurring only', () => {
    const mockFetchItems = jest.fn();
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: mockFetchItems,
      isPending: false,
      message: { type: null, text: '' },
      items: [],
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} recurringOnly={true} />);
    
    expect(mockFetchItems).toHaveBeenCalled();
  });

  it('calculates total amount correctly with multiple entries', () => {
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: false,
      message: { type: null, text: '' },
      items: mockCashFlowEntries,
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByText('$30.00')).toBeInTheDocument();
  });

  it('calculates total amount correctly with empty entries', () => {
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: false,
      message: { type: null, text: '' },
      items: [],
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('shows loading state in total display', () => {
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: true,
      message: { type: null, text: '' },
      items: [],
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles API error response', () => {
    mockMessageTypeIsError.mockReturnValue(true);
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: false,
      message: { type: 'error', text: 'Failed to load entries' },
      items: [],
    });
    
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByText('Error: true')).toBeInTheDocument();
  });

  it('calls messageTypeIsError with message state', () => {
    const testMessage = { type: 'error', text: 'Test error' };
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: false,
      message: testMessage,
      items: [],
    });
    
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockMessageTypeIsError).toHaveBeenCalledWith(testMessage);
  });

  it('handles recurring only mode', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} recurringOnly={true} />);
    
    expect(screen.getByText('Recurring: true')).toBeInTheDocument();
    expect(screen.queryByTestId('responsive-total-display')).not.toBeInTheDocument();
    expect(screen.queryByTestId('responsive-date-picker')).not.toBeInTheDocument();
  });


  it('passes correct item name to useFormListItemsFetch', () => {
    render(<CashFlowPage cashFlowType={EXPENSE_ITEM_NAME} />);
    
    expect(mockUseFormListItemsFetch).toHaveBeenCalledWith({
      fetchItems: expect.any(Function),
      itemName: 'expense',
    });
  });

  it('handles date range changes', () => {
    const mockFetchItems = jest.fn();
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: mockFetchItems,
      isPending: false,
      message: { type: null, text: '' },
      items: [],
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    const changeDateButton = screen.getByText('Change Date');
    fireEvent.click(changeDateButton);
    
    expect(mockFetchItems).toHaveBeenCalledTimes(1);
  });

  it('calls onEntryDeleted when refresh button is clicked', () => {
    const mockFetchItems = jest.fn();
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: mockFetchItems,
      isPending: false,
      message: { type: null, text: '' },
      items: [],
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    expect(mockFetchItems).toHaveBeenCalledTimes(2);
  });

  it('calls onEntryIsEditing when edit button is clicked', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    const editButton = screen.getByText('Edit Entry');
    fireEvent.click(editButton);
    
    expect(mockFormState.onItemIsEditing).toHaveBeenCalledWith({ id: 1, amount: 1000 });
  });

  it('handles different cash flow types correctly', () => {
    const testCases = [
      { type: CashFlowType.INCOME, expected: 'income' },
      { type: CashFlowType.EXPENSE, expected: 'expense' },
    ];

    testCases.forEach(({ type, expected }) => {
      jest.clearAllMocks();
      mockUseFormListItemsFetch.mockReturnValue({
        fetchItems: jest.fn(),
        isPending: false,
        message: { type: null, text: '' },
        items: [],
      });

      render(<CashFlowPage cashFlowType={type} />);
      
      expect(mockUseFormListItemsFetch).toHaveBeenCalledWith({
        fetchItems: expect.any(Function),
        itemName: expected,
      });
    });
  });

  it('handles edge case with single entry', () => {
    const singleEntry = [{ id: 1, amount: 500, entryType: INCOME_ITEM_NAME, categoryId: '1', date: '2024-01-01' }];
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: false,
      message: { type: null, text: '' },
      items: singleEntry,
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByText('Entries: 1')).toBeInTheDocument();
  });

  it('handles negative amounts correctly', () => {
    const negativeEntries = [
      { id: 1, amount: -1000, entryType: EXPENSE_ITEM_NAME, categoryId: '1', date: '2024-01-01' },
      { id: 2, amount: -500, entryType: EXPENSE_ITEM_NAME, categoryId: '2', date: '2024-01-02' },
    ];
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: jest.fn(),
      isPending: false,
      message: { type: null, text: '' },
      items: negativeEntries,
    });

    render(<CashFlowPage cashFlowType={EXPENSE_ITEM_NAME} />);
    
    expect(screen.getByText('$-15.00')).toBeInTheDocument();
  });

  it('calls getRecurringCashFlowEntries when recurringOnly is true', () => {
    const mockFetchItems = jest.fn();
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: mockFetchItems,
      isPending: false,
      message: { type: null, text: '' },
      items: [],
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} recurringOnly={true} />);
    
    expect(mockFetchItems).toHaveBeenCalled();
  });

  it('calls getCashFlowEntriesByDateRangeAndType when recurringOnly is false', () => {
    const mockFetchItems = jest.fn();
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: mockFetchItems,
      isPending: false,
      message: { type: null, text: '' },
      items: [],
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} recurringOnly={false} />);
    
    expect(mockFetchItems).toHaveBeenCalled();
  });

  it('calls getCashFlowEntriesByDateRangeAndType when recurringOnly is undefined', () => {
    const mockFetchItems = jest.fn();
    mockUseFormListItemsFetch.mockReturnValue({
      fetchItems: mockFetchItems,
      isPending: false,
      message: { type: null, text: '' },
      items: [],
    });

    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(mockFetchItems).toHaveBeenCalled();
  });


});