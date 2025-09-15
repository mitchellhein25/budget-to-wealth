import { render, screen, act } from '@testing-library/react';
import BudgetsPage from '@/app/cashflow/budget/page';

const cashFlowSideBarTestId = 'cash-flow-side-bar';
const budgetsFormTestId = 'budgets-form';
const datePickerTestId = 'date-picker';
const budgetSummaryTestId = 'budget-summary';
const budgetsListTestId = 'budgets-list';
const cashFlowSideBarText = 'Cash Flow Side Bar';
const budgetsFormText = 'Budgets Form';
const datePickerText = 'Date Picker';
const budgetSummaryText = 'Budget Summary';
const budgetsListText = 'Budgets List';

jest.mock('@/app/hooks', () => ({
  useForm: () => ({
    formData: {},
    onInputChange: jest.fn(),
    onSubmit: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: null,
  }),
  useFormListItemsFetch: () => ({
    fetchItems: jest.fn(),
    isPending: false,
    message: null,
  }),
  useMobileDetection: () => 'large',
  MobileState: {
    XSMALL: 'xsmall',
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    XLARGE: 'xlarge',
    XXLARGE: 'xxlarge',
  }
}));

jest.mock('@/app/lib/api', () => ({
  getBudgetsByDateRange: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
  getCashFlowEntriesByDateRangeAndType: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
  BUDGETS_ENDPOINT: '/api/budgets',
}));

jest.mock('@/app/lib/utils', () => ({
  getCurrentMonthRange: jest.fn(() => ({ start: new Date(), end: new Date() })),
  messageTypeIsError: jest.fn(() => false),
}));

jest.mock('@/app/components', () => ({
  DatePicker: () => <div data-testid={datePickerTestId}>{datePickerText}</div>,
  ResponsiveFormListPage: ({ sideBar, totalDisplay, datePicker, form, list }: { sideBar: React.ReactNode; totalDisplay: React.ReactNode; datePicker: React.ReactNode; form: React.ReactNode; list: React.ReactNode }) => (
    <div>
      {sideBar}
      {totalDisplay}
      {datePicker}
      {form}
      {list}
    </div>
  ),
}));

jest.mock('@/app/cashflow', () => ({
  CashFlowSideBar: () => <div data-testid={cashFlowSideBarTestId}>{cashFlowSideBarText}</div>,
  CashFlowEntry: {},
  EXPENSE_ITEM_NAME_LOWERCASE: 'expense',
}));

jest.mock('@/app/cashflow/budget', () => ({
  BudgetsForm: () => <div data-testid={budgetsFormTestId}>{budgetsFormText}</div>,
  BudgetsList: () => <div data-testid={budgetsListTestId}>{budgetsListText}</div>,
  BudgetSummary: () => <div data-testid={budgetSummaryTestId}>{budgetSummaryText}</div>,
  BudgetFormData: {},
  transformFormDataToBudget: jest.fn(),
  convertBudgetToFormData: jest.fn(),
  BUDGET_ITEM_NAME: 'Budget',
  BUDGET_ITEM_NAME_LOWERCASE: 'budget',
  Budget: {},
}));

describe('BudgetsPage', () => {
  it('renders the page correctly', async () => {
    await act(async () => {
      render(<BudgetsPage />);
    });
    
    expect(screen.getByTestId(cashFlowSideBarTestId)).toBeInTheDocument();
    expect(screen.getByTestId(budgetsFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(budgetSummaryTestId)).toBeInTheDocument();
    expect(screen.getByTestId(budgetsListTestId)).toBeInTheDocument();
  });

  it('renders all main components with correct content', async () => {
    await act(async () => {
      render(<BudgetsPage />);
    });
    
    expect(screen.getByText(cashFlowSideBarText)).toBeInTheDocument();
    expect(screen.getByText(budgetsFormText)).toBeInTheDocument();
    expect(screen.getByText(datePickerText)).toBeInTheDocument();
    expect(screen.getByText(budgetSummaryText)).toBeInTheDocument();
    expect(screen.getByText(budgetsListText)).toBeInTheDocument();
  });
}); 