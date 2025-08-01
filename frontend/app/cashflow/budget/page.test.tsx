import { render, screen, act } from '@testing-library/react';
import BudgetsPage from './page';

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
  useDataListFetcher: () => ({
    items: [],
    isLoading: false,
    message: null,
    fetchItems: jest.fn(),
  }),
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  getBudgetsByDateRange: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
  getCashFlowEntriesByDateRangeAndType: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
}));

jest.mock('@/app/components', () => ({
  DatePicker: () => <div data-testid={datePickerTestId}>{datePickerText}</div>,
  getCurrentMonthRange: jest.fn(() => ({ start: new Date(), end: new Date() })),
  messageTypeIsError: jest.fn(() => false),
}));

jest.mock('@/app/cashflow/components', () => ({
  CashFlowSideBar: () => <div data-testid={cashFlowSideBarTestId}>{cashFlowSideBarText}</div>,
}));

jest.mock('./components', () => ({
  BudgetsForm: () => <div data-testid={budgetsFormTestId}>{budgetsFormText}</div>,
  BudgetsList: () => <div data-testid={budgetsListTestId}>{budgetsListText}</div>,
  BudgetSummary: () => <div data-testid={budgetSummaryTestId}>{budgetSummaryText}</div>,
  BudgetFormData: {},
  transformFormDataToBudget: jest.fn(),
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