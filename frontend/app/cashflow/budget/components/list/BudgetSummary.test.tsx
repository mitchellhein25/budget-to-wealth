import { render, screen } from '@testing-library/react';
import { BUDGET_ITEM_NAME, BudgetSummary } from '../';
import { EXPENSE_ITEM_NAME } from '../../../components';

const totalDisplayTestId = 'total-display';
const totalDisplayText = 'Total Display';
const labelTestId = 'label';
const amountTestId = 'amount';
const isLoadingTestId = 'is-loading';

jest.mock('@/app/components', () => ({
  TotalDisplay: ({ label, amount, isLoading }: any) => (
    <div data-testid={totalDisplayTestId}>
      <div>{totalDisplayText}</div>
      <div data-testid={labelTestId}>{label}</div>
      <div data-testid={amountTestId}>{amount}</div>
      <div data-testid={isLoadingTestId}>{isLoading.toString()}</div>
    </div>
  ),
}));

describe('BudgetSummary', () => {
  const mockBudgets = [
    { id: 1, amount: 1000, categoryId: '1' },
    { id: 2, amount: 2000, categoryId: '2' },
  ] as any;
  
  const mockExpenses = [
    { id: 1, amount: 500, categoryId: '1' },
    { id: 2, amount: 1500, categoryId: '2' },
  ] as any;

  const mockDateRange = {
    from: new Date('2024-01-01'),
    to: new Date('2024-01-31'),
  };

  const mockProps = {
    budgets: mockBudgets,
    expenses: mockExpenses,
    dateRange: mockDateRange,
    isLoading: false,
  };

  it('renders total budget display', () => {
    render(<BudgetSummary {...mockProps} />);
    const totalDisplays = screen.getAllByTestId(totalDisplayTestId);
    expect(totalDisplays).toHaveLength(2);
    expect(screen.getByText(`Total ${BUDGET_ITEM_NAME}`)).toBeInTheDocument();
  });

  it('renders total expenses display', () => {
    render(<BudgetSummary {...mockProps} />);
    expect(screen.getByText(`Total ${EXPENSE_ITEM_NAME}s`)).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<BudgetSummary {...mockProps} isLoading={true} />);
    const loadingStates = screen.getAllByTestId(isLoadingTestId);
    expect(loadingStates[0]).toHaveTextContent('true');
  });

  it('calculates summary totals correctly', () => {
    render(<BudgetSummary {...mockProps} />);
    
    const totalDisplays = screen.getAllByTestId(totalDisplayTestId);
    expect(totalDisplays).toHaveLength(2);
    
    const amounts = screen.getAllByTestId(amountTestId);
    expect(amounts[0]).toHaveTextContent('3000');
    expect(amounts[1]).toHaveTextContent('2000');
  });

  it('shows correct over/under amount', () => {
    render(<BudgetSummary {...mockProps} />);
    
    expect(screen.getByText('+10.00')).toBeInTheDocument();
    expect(screen.getByText(`Under ${BUDGET_ITEM_NAME}`)).toBeInTheDocument();
  });

  it('handles over-budget scenario correctly', () => {
    const overBudgetExpenses = [
      { id: 1, amount: 2000, categoryId: '1' },
      { id: 2, amount: 2500, categoryId: '2' },
    ] as any;
    
    const propsWithOverBudget = {
      ...mockProps,
      expenses: overBudgetExpenses,
    };
    
    render(<BudgetSummary {...propsWithOverBudget} />);
    
    expect(screen.getByText('-15.00')).toBeInTheDocument();
    expect(screen.getByText(`Over ${BUDGET_ITEM_NAME}`)).toBeInTheDocument();
  });

  it('handles exact budget scenario correctly', () => {
    const exactBudgetExpenses = [
      { id: 1, amount: 1000, categoryId: '1' },
      { id: 2, amount: 2000, categoryId: '2' },
    ] as any;
    
    const propsWithExactBudget = {
      ...mockProps,
      expenses: exactBudgetExpenses,
    };
    
    render(<BudgetSummary {...propsWithExactBudget} />);
    
    expect(screen.getByText('+0.00')).toBeInTheDocument();
    expect(screen.getByText(`On ${BUDGET_ITEM_NAME}`)).toBeInTheDocument();
  });

  it('handles empty budgets and expenses', () => {
    const emptyProps = {
      ...mockProps,
      budgets: [],
      expenses: [],
    };
    
    render(<BudgetSummary {...emptyProps} />);
    
    const amounts = screen.getAllByTestId(amountTestId);
    expect(amounts[0]).toHaveTextContent('0');
    expect(amounts[1]).toHaveTextContent('0');
    expect(screen.getByText('+0.00')).toBeInTheDocument();
  });
}); 