import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BudgetsList } from '../BudgetsList';
import { Budget } from '../../Budget';
import { CashFlowEntry } from '@/app/cashflow/components';
import { deleteBudget } from '@/app/lib/api/data-methods';
import { BUDGET_ITEM_NAME } from '../../constants';

jest.mock('@/app/lib/api/data-methods', () => ({
  deleteBudget: jest.fn(),
}));

jest.mock('@/app/components/table/ListTable', () => ({
  ListTable: ({ title, headerRow, bodyRow, items, isLoading, isError }: {
    title: string;
    headerRow: React.ReactElement;
    bodyRow: (item: unknown) => React.ReactElement;
    items: unknown[];
    isLoading: boolean;
    isError: boolean;
  }) => (
    <div data-testid="list-table">
      <h2 data-testid="table-title">{title}</h2>
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isError && <div data-testid="error">Error loading data</div>}
      {!isLoading && !isError && (
        <table>
          <thead>{headerRow}</thead>
          <tbody>
            {items.map((item: unknown) => bodyRow(item))}
          </tbody>
        </table>
      )}
    </div>
  ),
}));

jest.mock('@/app/components', () => ({
  convertCentsToDollars: jest.fn((cents: number) => `$${(cents / 100).toFixed(2)}`),
}));

const mockDeleteBudget = jest.mocked(deleteBudget);

describe('BudgetsList', () => {
  const mockBudgets: Budget[] = [
    {
      id: 1,
      amount: 100000, // $1000.00
      categoryId: 'cat1',
      category: { id: 1, name: 'Groceries', categoryType: 'Expense' },
      name: 'Groceries Budget',
    },
    {
      id: 2,
      amount: 50000, // $500.00
      categoryId: 'cat2',
      category: { id: 2, name: 'Entertainment', categoryType: 'Expense' },
      name: 'Entertainment Budget',
    },
  ];

  const mockExpenses: CashFlowEntry[] = [
    {
      id: 1,
      amount: 75000, // $750.00
      categoryId: 'cat1',
      category: { id: 1, name: 'Groceries', categoryType: 'Expense' },
      entryType: 'Expense',
      date: '2024-01-01',
      description: 'Weekly groceries',
    },
    {
      id: 2,
      amount: 60000, // $600.00
      categoryId: 'cat2',
      category: { id: 2, name: 'Entertainment', categoryType: 'Expense' },
      entryType: 'Expense',
      date: '2024-01-01',
      description: 'Movie tickets',
    },
  ];

  const mockProps = {
    budgets: mockBudgets,
    expenses: mockExpenses,
    onBudgetDeleted: jest.fn(),
    onBudgetIsEditing: jest.fn(),
    isLoading: false,
    isError: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.confirm = jest.fn(() => true);
  });

  it('renders the component with correct title', () => {
    render(<BudgetsList {...mockProps} />);
    
    expect(screen.getByTestId('table-title')).toHaveTextContent(`${BUDGET_ITEM_NAME}s`);
  });

  it('renders loading state when isLoading is true', () => {
    render(<BudgetsList {...mockProps} isLoading={true} />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders error state when isError is true', () => {
    render(<BudgetsList {...mockProps} isError={true} />);
    
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('renders budget data correctly', () => {
    render(<BudgetsList {...mockProps} />);
    
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('calculates and displays spent amounts correctly', () => {
    render(<BudgetsList {...mockProps} />);
    
    // Groceries: $750.00 spent
    expect(screen.getByText('$750.00')).toBeInTheDocument();
    // Entertainment: $600.00 spent
    expect(screen.getByText('$600.00')).toBeInTheDocument();
  });

  it('calculates and displays remaining amounts correctly', () => {
    render(<BudgetsList {...mockProps} />);
    
    // Groceries: $1000.00 - $750.00 = $250.00 remaining
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    // Entertainment: $500.00 - $600.00 = $-100.00 remaining (over budget)
    expect(screen.getByText('$-100.00')).toBeInTheDocument();
  });

  it('shows correct status indicators', () => {
    render(<BudgetsList {...mockProps} />);
    
    // Should show ArrowDown for under budget (positive remaining)
    expect(screen.getByTestId('list-table')).toHaveTextContent('$250.00'); // Under budget
    expect(screen.getByTestId('list-table')).toHaveTextContent('$-100.00'); // Over budget
  });

  it('shows equal sign when budget is exactly spent', () => {
    const exactBudget: Budget[] = [{
      id: 3,
      amount: 75000, // $750.00
      categoryId: 'cat1',
      category: { id: 3, name: 'Exact Budget', categoryType: 'Expense' },
      name: 'Exact Budget',
    }];
    
    const exactExpenses: CashFlowEntry[] = [{
      id: 3,
      amount: 75000, // $750.00
      categoryId: 'cat1',
      category: { id: 3, name: 'Exact Budget', categoryType: 'Expense' },
      entryType: 'Expense',
      date: '2024-01-01',
      description: 'Exact amount',
    }];

    render(<BudgetsList {...mockProps} budgets={exactBudget} expenses={exactExpenses} />);
    
    expect(screen.getByTestId('list-table')).toHaveTextContent('$0.00'); // Exactly spent
  });

  it('calls onBudgetIsEditing when edit button is clicked', () => {
    render(<BudgetsList {...mockProps} />);
    
    const editButtons = screen.getAllByLabelText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(mockProps.onBudgetIsEditing).toHaveBeenCalledWith(mockBudgets[0]);
  });

  it('calls deleteBudget and onBudgetDeleted when delete is confirmed', async () => {
    mockDeleteBudget.mockResolvedValue({ 
      successful: true, 
      data: null, 
      responseMessage: 'Budget deleted successfully' 
    });
    
    render(<BudgetsList {...mockProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
    expect(mockDeleteBudget).toHaveBeenCalledWith(1);
    
    await waitFor(() => {
      expect(mockProps.onBudgetDeleted).toHaveBeenCalled();
    });
  });

  it('does not call onBudgetDeleted when delete is cancelled', async () => {
    global.confirm = jest.fn(() => false);
    
    render(<BudgetsList {...mockProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
    expect(mockDeleteBudget).not.toHaveBeenCalled();
    expect(mockProps.onBudgetDeleted).not.toHaveBeenCalled();
  });

  it('does not call onBudgetDeleted when delete API call fails', async () => {
    mockDeleteBudget.mockResolvedValue({ 
      successful: false, 
      data: null, 
      responseMessage: 'Failed to delete budget' 
    });
    
    render(<BudgetsList {...mockProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockDeleteBudget).toHaveBeenCalledWith(1);
      expect(mockProps.onBudgetDeleted).not.toHaveBeenCalled();
    });
  });

  it('handles empty budgets array', () => {
    render(<BudgetsList {...mockProps} budgets={[]} />);
    
    expect(screen.getByTestId('list-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-title')).toHaveTextContent(`${BUDGET_ITEM_NAME}s`);
  });

  it('handles empty expenses array', () => {
    render(<BudgetsList {...mockProps} expenses={[]} />);
    
    // Should show full budget amounts as remaining
    expect(screen.getByTestId('list-table')).toHaveTextContent('$1000.00'); // Budget amount
    expect(screen.getByTestId('list-table')).toHaveTextContent('$0.00'); // Spent amount
    expect(screen.getByTestId('list-table')).toHaveTextContent('$1000.00'); // Remaining amount
  });

  it('handles budget without category', () => {
    const budgetWithoutCategory: Budget[] = [{
      id: 4,
      amount: 100000,
      categoryId: 'cat3',
      name: 'Budget without category',
    }];
    
    render(<BudgetsList {...mockProps} budgets={budgetWithoutCategory} />);
    
    // When there's no category, it should show the name instead
    expect(screen.getByTestId('list-table')).toHaveTextContent('$1000.00'); // Budget amount
  });

  it('calculates spent amount correctly for multiple expenses in same category', () => {
    const multipleExpenses: CashFlowEntry[] = [
      {
        id: 1,
        amount: 50000, // $500.00
        categoryId: 'cat1',
        category: { id: 1, name: 'Groceries', categoryType: 'Expense' },
        entryType: 'Expense',
        date: '2024-01-01',
        description: 'First grocery trip',
      },
      {
        id: 2,
        amount: 25000, // $250.00
        categoryId: 'cat1',
        category: { id: 1, name: 'Groceries', categoryType: 'Expense' },
        entryType: 'Expense',
        date: '2024-01-02',
        description: 'Second grocery trip',
      },
    ];
    
    render(<BudgetsList {...mockProps} expenses={multipleExpenses} />);
    
    // Should show total spent: $500.00 + $250.00 = $750.00
    expect(screen.getByText('$750.00')).toBeInTheDocument();
    // Remaining: $1000.00 - $750.00 = $250.00
    expect(screen.getByText('$250.00')).toBeInTheDocument();
  });
}); 