import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryPage from './page';
import { useFormListItemsFetch, useSidebarDetection, useMobileDetection, MobileState } from '@/app/hooks';
import { getCurrentMonthRange } from '@/app/lib/utils';
import { CashFlowEntry, CashFlowType } from '@/app/cashflow';
import { DateRange } from '@/app/components';

jest.mock('@/app/hooks', () => ({
  useFormListItemsFetch: jest.fn(),
  useSidebarDetection: jest.fn(),
  useMobileDetection: jest.fn(),
  MobileState: {
    XSMALL: 'xsmall',
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    XLARGE: 'xlarge',
    XXLARGE: 'xxlarge',
  }
}));

jest.mock('@/app/lib/utils', () => ({
  getCurrentMonthRange: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  DatePicker: ({ dateRange, setDateRange }: { dateRange: DateRange, setDateRange: (range: DateRange) => void }) => (
    <div data-testid="date-picker">
      <span data-testid="date-range">{JSON.stringify(dateRange)}</span>
      <button onClick={() => setDateRange({ from: new Date('2024-01-01'), to: new Date('2024-01-31') })}>
        Change Date
      </button>
    </div>
  ),
  TotalDisplay: ({ label, amount, isLoading, marginOverride, className, amountPrefix, labelSuffix }: {
    label: string;
    amount: number;
    isLoading: boolean;
    marginOverride?: string;
    className?: string;
    amountPrefix?: string;
    labelSuffix?: React.ReactNode;
  }) => (
    <div 
      data-testid={`total-display-${label.toLowerCase().replace(/\s+/g, '-')}`}
      data-loading={isLoading}
      data-margin-override={marginOverride}
      className={className}
    >
      <span data-testid="label">{label}</span>
      <span data-testid="amount">{amountPrefix}{amount}</span>
      {labelSuffix && <div data-testid="label-suffix">{labelSuffix}</div>}
    </div>
  ),
}));

jest.mock('@/app/cashflow', () => ({
  CashFlowType: {
    EXPENSE: 'EXPENSE',
    INCOME: 'INCOME',
  },
  CashFlowSideBar: () => <div data-testid="cashflow-sidebar">Sidebar</div>,
  EXPENSE_ITEM_NAME_LOWERCASE: 'expense',
  INCOME_ITEM_NAME_LOWERCASE: 'income',
  INCOME_ITEM_NAME: 'Income',
  EXPENSE_ITEM_NAME: 'Expense',
  CASHFLOW_ITEM_NAME: 'Cashflow',
}));

jest.mock('@/app/components/ui/OverUnderOnIcon', () => {
  return function OverUnderOnIcon({ value, size }: { value: number, size: number }) {
    return <div data-testid="over-under-icon" data-value={value} data-size={size}>Icon</div>;
  };
});

const mockUseFormListItemsFetch = useFormListItemsFetch as jest.MockedFunction<typeof useFormListItemsFetch>;
const mockUseSidebarDetection = useSidebarDetection as jest.MockedFunction<typeof useSidebarDetection>;
const mockUseMobileDetection = useMobileDetection as jest.MockedFunction<typeof useMobileDetection>;
const mockGetCurrentMonthRange = getCurrentMonthRange as jest.MockedFunction<typeof getCurrentMonthRange>;

const mockDateRange = {
  from: new Date('2024-01-01'),
  to: new Date('2024-01-31')
};

const mockExpenseEntries: CashFlowEntry[] = [
  { id: 1, amount: 1000, description: 'Rent', entryType: CashFlowType.EXPENSE, date: '2024-01-01', categoryId: '1', userId: '1', recurrenceFrequency: undefined, recurrenceEndDate: undefined },
  { id: 2, amount: 500, description: 'Groceries', entryType: CashFlowType.EXPENSE, date: '2024-01-02', categoryId: '2', userId: '1', recurrenceFrequency: undefined, recurrenceEndDate: undefined }
];

const mockIncomeEntries: CashFlowEntry[] = [
  { id: 3, amount: 3000, description: 'Salary', entryType: CashFlowType.INCOME, date: '2024-01-01', categoryId: '3', userId: '1', recurrenceFrequency: undefined, recurrenceEndDate: undefined },
  { id: 4, amount: 200, description: 'Bonus', entryType: CashFlowType.INCOME, date: '2024-01-15', categoryId: '4', userId: '1', recurrenceFrequency: undefined, recurrenceEndDate: undefined }
];

describe('SummaryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockGetCurrentMonthRange.mockReturnValue(mockDateRange);
    mockUseSidebarDetection.mockReturnValue(true);
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    
    mockUseFormListItemsFetch
      .mockReturnValueOnce({
        fetchItems: jest.fn(),
        isPending: false,
        message: { type: null, text: '' },
        items: mockExpenseEntries
      })
      .mockReturnValueOnce({
        fetchItems: jest.fn(),
        isPending: false,
        message: { type: null, text: '' },
        items: mockIncomeEntries
      });
  });

  it('renders the summary page with all components', () => {
    render(<SummaryPage />);
    
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('cashflow-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('total-display-total-income')).toBeInTheDocument();
    expect(screen.getByTestId('total-display-total-expense')).toBeInTheDocument();
    expect(screen.getByTestId('total-display-cashflow')).toBeInTheDocument();
  });

  it('displays correct totals for income and expenses', () => {
    render(<SummaryPage />);
    
    expect(screen.getByTestId('total-display-total-income')).toHaveTextContent('3200');
    expect(screen.getByTestId('total-display-total-expense')).toHaveTextContent('1500');
    expect(screen.getByTestId('total-display-cashflow')).toHaveTextContent('+1700');
  });


  it('renders mobile layout when mobile state is XSMALL', () => {
    mockUseMobileDetection.mockReturnValue(MobileState.XSMALL);
    
    render(<SummaryPage />);
    
    const incomeDisplay = screen.getByTestId('total-display-total-income');
    const expenseDisplay = screen.getByTestId('total-display-total-expense');
    const cashflowDisplay = screen.getByTestId('total-display-cashflow');
    
    expect(incomeDisplay).toHaveAttribute('data-margin-override', 'm-0');
    expect(expenseDisplay).toHaveAttribute('data-margin-override', 'm-0');
    expect(cashflowDisplay).toHaveAttribute('data-margin-override', 'm-0');
  });

  it('renders desktop layout when mobile state is not XSMALL', () => {
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    
    render(<SummaryPage />);
    
    const incomeDisplay = screen.getByTestId('total-display-total-income');
    const expenseDisplay = screen.getByTestId('total-display-total-expense');
    const cashflowDisplay = screen.getByTestId('total-display-cashflow');
    
    expect(incomeDisplay).not.toHaveAttribute('data-margin-override');
    expect(expenseDisplay).not.toHaveAttribute('data-margin-override');
    expect(cashflowDisplay).not.toHaveAttribute('data-margin-override');
  });

  it('hides sidebar when showSidebar is false', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    
    render(<SummaryPage />);
    
    expect(screen.queryByTestId('cashflow-sidebar')).not.toBeInTheDocument();
  });

  it('handles empty data arrays correctly', () => {
    mockUseFormListItemsFetch
      .mockReturnValueOnce({
        fetchItems: jest.fn(),
        isPending: false,
        message: { type: null, text: '' },
        items: []
      })
      .mockReturnValueOnce({
        fetchItems: jest.fn(),
        isPending: false,
        message: { type: null, text: '' },
        items: []
      });

    render(<SummaryPage />);
    
    expect(screen.getByTestId('total-display-total-income')).toHaveTextContent('0');
    expect(screen.getByTestId('total-display-total-expense')).toHaveTextContent('0');
    expect(screen.getByTestId('total-display-cashflow')).toHaveTextContent('0');
  });


  it('shows zero cashflow with correct icon', () => {
    const equalEntries: CashFlowEntry[] = [
      { id: 1, amount: 1500, description: 'Equal Expense', entryType: CashFlowType.EXPENSE, date: '2024-01-01', categoryId: '1', userId: '1', recurrenceFrequency: undefined, recurrenceEndDate: undefined }
    ];
    
    mockUseFormListItemsFetch
      .mockReturnValueOnce({
        fetchItems: jest.fn(),
        isPending: false,
        message: { type: null, text: '' },
        items: equalEntries
      })
      .mockReturnValueOnce({
        fetchItems: jest.fn(),
        isPending: false,
        message: { type: null, text: '' },
        items: equalEntries
      });

    render(<SummaryPage />);
    
    const cashflowDisplay = screen.getByTestId('total-display-cashflow');
    expect(cashflowDisplay).toHaveTextContent('0');
    expect(screen.getByTestId('over-under-icon')).toHaveAttribute('data-value', '0');
  });


  it('handles date range changes', () => {
    render(<SummaryPage />);
    
    const changeDateButton = screen.getByText('Change Date');
    
    act(() => {
      changeDateButton.click();
    });
    
    expect(screen.getByTestId('date-range')).toHaveTextContent('{"from":"2024-01-01T00:00:00.000Z","to":"2024-01-31T00:00:00.000Z"}');
  });

  it('applies correct CSS classes to total displays', () => {
    render(<SummaryPage />);
    
    expect(screen.getByTestId('total-display-total-income')).toHaveClass('w-2/5');
    expect(screen.getByTestId('total-display-total-expense')).toHaveClass('w-2/5');
    expect(screen.getByTestId('total-display-cashflow')).toHaveClass('w-4/5');
  });
});
