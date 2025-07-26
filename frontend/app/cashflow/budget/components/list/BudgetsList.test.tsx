import { render, screen } from '@testing-library/react';
import { BUDGET_ITEM_NAME, BudgetsList } from '../';

const listTableTestId = 'list-table';
const listTableText = 'List Table';
const titleTestId = 'title';
const itemsCountTestId = 'items-count';
const isErrorTestId = 'is-error';
const isLoadingTestId = 'is-loading';

jest.mock('@/app/components/table/ListTable', () => ({
  ListTable: ({ title, headerRow, bodyRow, items, isError, isLoading }: any) => (
    <div data-testid={listTableTestId}>
      <div>{listTableText}</div>
      <div data-testid={titleTestId}>{title}</div>
      <div data-testid={itemsCountTestId}>{items?.length || 0}</div>
      <div data-testid={isErrorTestId}>{isError.toString()}</div>
      <div data-testid={isLoadingTestId}>{isLoading.toString()}</div>
      <div data-testid="table-rows">
        {items?.map((item: any, index: number) => (
          <div key={index} data-testid={`row-${index}`}>
            <div data-testid={`budget-amount-${index}`}>
              {bodyRow(item).props.children[1].props.children}
            </div>
            <div data-testid={`spent-amount-${index}`}>
              {bodyRow(item).props.children[2].props.children}
            </div>
            <div data-testid={`remaining-amount-${index}`}>
              {bodyRow(item).props.children[3].props.children}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  deleteBudget: jest.fn(),
}));

describe('BudgetsList', () => {
  const mockBudgets = [
    { id: 1, amount: 1700, categoryId: '1', category: { name: 'Food', categoryType: 'EXPENSE' }, date: '2024-01-01' },
    { id: 2, amount: 2100, categoryId: '2', category: { name: 'Transport', categoryType: 'EXPENSE' }, date: '2024-01-01' },
  ] as any;
  
  const mockExpenses = [
    { id: 1, amount: 500, categoryId: '1' },
    { id: 2, amount: 1500, categoryId: '2' },
  ] as any;

  const mockProps = {
    budgets: mockBudgets,
    expenses: mockExpenses,
    onBudgetDeleted: jest.fn(),
    onBudgetIsEditing: jest.fn(),
    isLoading: false,
    isError: false,
  };

  it('renders with correct title', () => {
    render(<BudgetsList {...mockProps} />);
    expect(screen.getByTestId(titleTestId)).toHaveTextContent(`${BUDGET_ITEM_NAME}s`);
  });

  it('passes correct props to ListTable', () => {
    render(<BudgetsList {...mockProps} />);
    expect(screen.getByTestId(listTableTestId)).toBeInTheDocument();
    expect(screen.getByTestId(itemsCountTestId)).toHaveTextContent('2');
    expect(screen.getByTestId(isErrorTestId)).toHaveTextContent('false');
    expect(screen.getByTestId(isLoadingTestId)).toHaveTextContent('false');
  });

  it('handles loading state', () => {
    render(<BudgetsList {...mockProps} isLoading={true} />);
    expect(screen.getByTestId(isLoadingTestId)).toHaveTextContent('true');
  });

  it('handles error state', () => {
    render(<BudgetsList {...mockProps} isError={true} />);
    expect(screen.getByTestId(isErrorTestId)).toHaveTextContent('true');
  });

  it('calculates totals correctly', () => {
    render(<BudgetsList {...mockProps} />);
    
    expect(screen.getByTestId('table-rows')).toBeInTheDocument();
    expect(screen.getByTestId('row-0')).toBeInTheDocument();
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    
    const rows = screen.getAllByTestId(/^row-/);
    expect(rows).toHaveLength(2);
    
    // Budget 1: $17.00 budget, $5.00 spent, $12.00 remaining
    expect(screen.getByTestId('budget-amount-0')).toHaveTextContent('$17.00');
    expect(screen.getByTestId('spent-amount-0')).toHaveTextContent('$5.00');
    expect(screen.getByTestId('remaining-amount-0')).toHaveTextContent('$12.00');

    // Budget 2: $21.00 budget, $15.00 spent, $6.00 remaining
    expect(screen.getByTestId('budget-amount-1')).toHaveTextContent('$21.00');
    expect(screen.getByTestId('spent-amount-1')).toHaveTextContent('$15.00');
    expect(screen.getByTestId('remaining-amount-1')).toHaveTextContent('$6.00');
  });

  it('handles empty expenses correctly', () => {
    const propsWithNoExpenses = {
      ...mockProps,
      expenses: [],
    };
    
    render(<BudgetsList {...propsWithNoExpenses} />);
    
    expect(screen.getByTestId('table-rows')).toBeInTheDocument();
    expect(screen.getByTestId('row-0')).toBeInTheDocument();
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
  });

  it('handles over-budget scenarios correctly', () => {
    const overBudgetExpenses = [
      { id: 1, amount: 1500, categoryId: '1' },
      { id: 2, amount: 2200, categoryId: '2' },
    ] as any;
    
    const propsWithOverBudget = {
      ...mockProps,
      expenses: overBudgetExpenses,
    };
    
    render(<BudgetsList {...propsWithOverBudget} />);
    
    // Should still render the table with budgets
    expect(screen.getByTestId('table-rows')).toBeInTheDocument();
    expect(screen.getByTestId('row-0')).toBeInTheDocument();
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    
    // Budget 1: $17.00 budget, $15.00 spent, $2.00 remaining
    expect(screen.getByTestId('budget-amount-0')).toHaveTextContent('$17.00');
    expect(screen.getByTestId('spent-amount-0')).toHaveTextContent('$15.00');
    expect(screen.getByTestId('remaining-amount-0')).toHaveTextContent('$2.00');
    
    // Budget 2: $21.00 budget, $22.00 spent, -$1.00 remaining (over budget)
    expect(screen.getByTestId('budget-amount-1')).toHaveTextContent('$21.00');
    expect(screen.getByTestId('spent-amount-1')).toHaveTextContent('$22.00');
    expect(screen.getByTestId('remaining-amount-1')).toHaveTextContent('-$1.00');
  });
}); 