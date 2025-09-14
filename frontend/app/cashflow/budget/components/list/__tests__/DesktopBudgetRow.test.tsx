import { render, screen, fireEvent } from '@testing-library/react';
import { CashFlowEntry, CashFlowType } from '@/app/cashflow';
import { DesktopBudgetRow } from '@/app/cashflow/budget/components/list/DesktopBudgetRow';
import { Budget } from '@/app/cashflow/budget';

const editLabel = 'Edit';
const deleteLabel = 'Delete';

jest.mock('@/app/lib/utils', () => ({
  convertCentsToDollars: jest.fn((cents) => `$${(cents / 100).toFixed(2)}`),
  replaceSpacesWithDashes: jest.fn((str) => str.replace(/\s+/g, '-')),
}));

jest.mock('lucide-react', () => ({
  Equal: () => <svg data-testid="equal-icon" />,
  ArrowUp: () => <svg data-testid="arrow-up-icon" />,
  ArrowDown: () => <svg data-testid="arrow-down-icon" />,
}));

jest.mock('@/app/components', () => ({
  DesktopListItemRow: ({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <tr>
      {children}
      <td>
        <button aria-label={editLabel} onClick={onEdit}>E</button>
        <button aria-label={deleteLabel} onClick={onDelete}>D</button>
      </td>
    </tr>
  ),
  DesktopListItemCell: ({ children, title, className }: { children: React.ReactNode; title?: string; className?: string }) => (
    <td title={title} className={className}>{children}</td>
  ),
  TruncatedBadge: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <span title={title}>{children}</span>
  ),
}));

describe('DesktopBudgetRow', () => {
  const baseBudget: Budget = {
    id: 1,
    amount: 100000,
    categoryId: 'cat1',
    category: { id: 1, name: 'Food', date: '2025-01-01', categoryType: CashFlowType.EXPENSE },
    name: 'Food Budget',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    userId: 'user1'
  };

  const baseExpenses: CashFlowEntry[] = [
    {
      id: 1,
      amount: 40000,
      date: '2025-01-15',
      description: 'Groceries',
      categoryId: 'cat1',
      entryType: CashFlowType.EXPENSE,
    } as CashFlowEntry,
    {
      id: 2,
      amount: 20000,
      date: '2025-01-20',
      description: 'Restaurant',
      categoryId: 'cat1',
      entryType: CashFlowType.EXPENSE,
    } as CashFlowEntry,
  ];

  const columnWidths = {
    category: 'w-4/12',
    amount: 'w-2/12',
    spent: 'w-2/12',
    remaining: 'w-2/12',
    actions: 'w-2/12'
  };

  it('renders budget row correctly', () => {
    render(
      <table>
        <tbody>
          <DesktopBudgetRow
            budget={baseBudget}
            expenses={baseExpenses}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            columnWidths={columnWidths}
          />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    const spentCells = screen.getAllByText('$600.00');
    expect(spentCells.length).toBeGreaterThanOrEqual(1);
    const remainingCells = screen.getAllByText('$400.00');
    expect(remainingCells.length).toBeGreaterThanOrEqual(1);
    const arrowIcon = screen.getByTestId('arrow-down-icon');
    expect(arrowIcon).toBeInTheDocument();
    expect(arrowIcon.closest('span')).toHaveClass('text-green-500');
  });

  it('does not render category badge when category is missing', () => {
    const budgetWithoutCategory = { ...baseBudget, category: undefined };
    render(
      <table>
        <tbody>
          <DesktopBudgetRow
            budget={budgetWithoutCategory}
            expenses={baseExpenses}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            columnWidths={columnWidths}
          />
        </tbody>
      </table>
    );
    
    expect(screen.queryByText('Food')).not.toBeInTheDocument();
  });

  it('shows yellow equal icon when remaining budget is zero', () => {
    const expensesEqualBudget: CashFlowEntry[] = [
      {
        id: 1,
        amount: 100000, // $1000.00 - exactly the budget
        date: '2025-01-15',
        description: 'Full budget spent',
        categoryId: 'cat1',
        entryType: CashFlowType.EXPENSE,
      } as CashFlowEntry,
    ];

    render(
      <table>
        <tbody>
          <DesktopBudgetRow
            budget={baseBudget}
            expenses={expensesEqualBudget}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            columnWidths={columnWidths}
          />
        </tbody>
      </table>
    );
    
    const equalIcon = screen.getByTestId('equal-icon');
    expect(equalIcon).toBeInTheDocument();
    expect(equalIcon.closest('span')).toHaveClass('text-yellow-500');
  });

  it('Shows correctly when over budget', () => {
    const overBudgetExpenses: CashFlowEntry[] = [
      {
        id: 1,
        amount: 150000, // $1500.00 - over the $1000.00 budget
        date: '2025-01-15',
        description: 'Over budget expense',
        categoryId: 'cat1',
        entryType: CashFlowType.EXPENSE,
      } as CashFlowEntry,
    ];

    render(
      <table>
        <tbody>
          <DesktopBudgetRow
            budget={baseBudget}
            expenses={overBudgetExpenses}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            columnWidths={columnWidths}
          />
        </tbody>
      </table>
    );
    
    const arrowIcon = screen.getByTestId('arrow-up-icon');
    expect(arrowIcon).toBeInTheDocument();
    expect(arrowIcon.closest('span')).toHaveClass('text-red-500');
    expect(screen.getByText('$-500.00')).toBeInTheDocument();
  });

  it('filters expenses by category correctly', () => {
    const mixedExpenses: CashFlowEntry[] = [
      {
        id: 1,
        amount: 30000, // $300.00 - same category as budget
        date: '2025-01-15',
        description: 'Groceries',
        categoryId: 'cat1',
        entryType: CashFlowType.EXPENSE,
      } as CashFlowEntry,
      {
        id: 2,
        amount: 50000, // $500.00 - different category
        date: '2025-01-20',
        description: 'Gas',
        categoryId: 'cat2',
        entryType: CashFlowType.EXPENSE,
      } as CashFlowEntry,
    ];

    render(
      <table>
        <tbody>
          <DesktopBudgetRow
            budget={baseBudget}
            expenses={mixedExpenses}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            columnWidths={columnWidths}
          />
        </tbody>
      </table>
    );
    
    // Should only count the $300.00 expense from the same category
    expect(screen.getByText('$300.00')).toBeInTheDocument();
  });

  it('handles empty expenses array', () => {
    render(
      <table>
        <tbody>
          <DesktopBudgetRow
            budget={baseBudget}
            expenses={[]}
            onEdit={jest.fn()}
            onDelete={jest.fn()}
            columnWidths={columnWidths}
          />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('$0.00')).toBeInTheDocument(); // No expenses spent
    // Full budget remaining - check that it appears (could be in multiple places)
    const budgetCells = screen.getAllByText('$1000.00');
    expect(budgetCells.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onEdit with correct budget when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(
      <table>
        <tbody>
          <DesktopBudgetRow
            budget={baseBudget}
            expenses={baseExpenses}
            onEdit={onEdit}
            onDelete={jest.fn()}
            columnWidths={columnWidths}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByLabelText(editLabel));
    expect(onEdit).toHaveBeenCalledWith(baseBudget);
  });

  it('calls onDelete with correct budget id when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(
      <table>
        <tbody>
          <DesktopBudgetRow
            budget={baseBudget}
            expenses={baseExpenses}
            onEdit={jest.fn()}
            onDelete={onDelete}
            columnWidths={columnWidths}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByLabelText(deleteLabel));
    expect(onDelete).toHaveBeenCalledWith(baseBudget.id);
  });
});
