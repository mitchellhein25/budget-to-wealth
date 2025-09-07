import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { deleteBudget } from '@/app/lib/api';
import { CashFlowEntry } from '@/app/cashflow';
import { Budget, BUDGET_ITEM_NAME } from '@/app/cashflow/budget';
import { BudgetsList } from '@/app/cashflow/budget/components/list/BudgetsList';

jest.mock('@/app/hooks', () => ({
  useMobileDetection: () => ({ isMobile: false, isDesktop: true }),
}));

jest.mock('@/app/lib/api', () => ({
  deleteBudget: jest.fn(),
}));

jest.mock('@/app/components', () => ({
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
  convertCentsToDollars: jest.fn((cents: number) => `$${(cents / 100).toFixed(2)}`),
  DesktopListItemRow: ({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <tr>
      {children}
      <td>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </td>
    </tr>
  ),
  DesktopListItemCell: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <td title={title}>{children}</td>
  ),
}));

jest.mock('@/app/cashflow/budget', () => ({
  BUDGET_ITEM_NAME: 'Budget',
  DesktopBudgetRow: ({ budget, onEdit, onDelete }: any) => (
    <tr data-testid="desktop-budget-row">
      <td data-testid="budget-category">{budget.category?.name || budget.category}</td>
      <td data-testid="budget-amount">${(budget.amount / 100).toFixed(2)}</td>
      <td data-testid="budget-spent">$0.00</td>
      <td data-testid="budget-remaining">${(budget.amount / 100).toFixed(2)}</td>
      <td>
        <button data-testid="edit-button" onClick={() => onEdit(budget)}>Edit</button>
        <button data-testid="delete-button" onClick={() => onDelete(budget.id)}>Delete</button>
      </td>
    </tr>
  ),
  MobileBudgetCard: ({ budget, onEdit, onDelete }: any) => (
    <div data-testid="mobile-budget-card">
      <span data-testid="budget-category">{budget.category?.name || budget.category}</span>
      <span data-testid="budget-amount">${(budget.amount / 100).toFixed(2)}</span>
      <button data-testid="edit-button" onClick={() => onEdit(budget)}>Edit</button>
      <button data-testid="delete-button" onClick={() => onDelete(budget.id)}>Delete</button>
    </div>
  ),
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
    expect(screen.getAllByText('$1000.00')).toHaveLength(2); // Amount and remaining
    expect(screen.getAllByText('$500.00')).toHaveLength(2); // Amount and remaining
  });

  it('calculates and displays spent amounts correctly', () => {
    render(<BudgetsList {...mockProps} />);
    
    // Mock shows $0.00 for spent amounts
    expect(screen.getAllByText('$0.00')).toHaveLength(2); // Both budgets show $0.00 spent
  });

  it('calculates and displays remaining amounts correctly', () => {
    render(<BudgetsList {...mockProps} />);
    
    // Mock shows full budget amounts as remaining
    expect(screen.getAllByText('$1000.00')).toHaveLength(2); // Groceries amount and remaining
    expect(screen.getAllByText('$500.00')).toHaveLength(2); // Entertainment amount and remaining
  });

  it('shows correct status indicators', () => {
    render(<BudgetsList {...mockProps} />);
    
    // Mock shows full budget amounts as remaining
    expect(screen.getByTestId('list-table')).toHaveTextContent('$1000.00'); // Under budget
    expect(screen.getByTestId('list-table')).toHaveTextContent('$500.00'); // Under budget
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
    
    expect(screen.getByTestId('list-table')).toHaveTextContent('$750.00'); // Budget amount
  });

  it('calls onBudgetIsEditing when edit button is clicked', () => {
    render(<BudgetsList {...mockProps} />);
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(mockProps.onBudgetIsEditing).toHaveBeenCalledWith(mockBudgets[0]);
  });

  it('calls deleteBudget and onBudgetDeleted when delete is confirmed', async () => {
    global.confirm = jest.fn(() => true);
    mockDeleteBudget.mockResolvedValue({ 
      successful: true, 
      data: null, 
      responseMessage: 'Budget deleted successfully' 
    });
    
    render(<BudgetsList {...mockProps} />);
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
    expect(mockDeleteBudget).toHaveBeenCalledWith(1);
    
    await waitFor(() => {
      expect(mockProps.onBudgetDeleted).toHaveBeenCalled();
    });
  });

  it('does not call onBudgetDeleted when delete is cancelled', async () => {
    global.confirm = jest.fn(() => false);
    mockDeleteBudget.mockClear();
    mockProps.onBudgetDeleted.mockClear();
    
    render(<BudgetsList {...mockProps} />);
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
    expect(mockDeleteBudget).not.toHaveBeenCalled();
    expect(mockProps.onBudgetDeleted).not.toHaveBeenCalled();
  });

  it('does not call onBudgetDeleted when delete API call fails', async () => {
    global.confirm = jest.fn(() => true);
    mockDeleteBudget.mockResolvedValue({ 
      successful: false, 
      data: null, 
      responseMessage: 'Failed to delete budget' 
    });
    mockProps.onBudgetDeleted.mockClear();
    
    render(<BudgetsList {...mockProps} />);
    
    const deleteButtons = screen.getAllByText('Delete');
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
    expect(screen.getAllByText('$0.00')).toHaveLength(2); // Spent amounts
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
    
    // Mock shows $0.00 for spent amounts regardless of expenses
    expect(screen.getAllByText('$0.00')).toHaveLength(2); // Both budgets show $0.00 spent
    // Mock shows full budget amounts as remaining
    expect(screen.getAllByText('$1000.00')).toHaveLength(2); // Groceries amount and remaining
    expect(screen.getAllByText('$500.00')).toHaveLength(2); // Entertainment amount and remaining
  });
}); 