import { render, screen, fireEvent } from '@testing-library/react';
import { CashFlowEntry } from '@/app/cashflow';
import { MobileBudgetCard, Budget } from '@/app/cashflow/budget';

const mockBudget: Budget = {
  id: 1,
  amount: 10000,
  categoryId: 'category-1',
  category: {
    id: 1,
    name: 'Groceries',
    categoryType: 'Expense'
  },
  date: '2023-01-01'
};

const mockExpenses: CashFlowEntry[] = [
  {
    id: 1,
    amount: 3000,
    date: '2023-01-15',
    categoryId: 'category-1',
    description: 'Food shopping',
    entryType: 'Expense'
  },
  {
    id: 2,
    amount: 2000,
    date: '2023-01-20',
    categoryId: 'category-1',
    description: 'More groceries',
    entryType: 'Expense'
  }
];

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

jest.mock('@/app/components', () => ({
  convertCentsToDollars: jest.fn((amount: number) => `$${(amount / 100).toFixed(2)}`),
  MobileListItemCard: ({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <div data-testid="mobile-list-item-card">
      {children}
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  ),
  MobileListItemCardHeader: ({ leftContent, rightContent }: { leftContent: React.ReactNode; rightContent?: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card-header">
      <div>{leftContent}</div>
      <div>{rightContent}</div>
    </div>
  ),
  MobileListItemCardContent: ({ description }: { description: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card-content">
      {description}
    </div>
  ),
  EditButton: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="edit-button" onClick={onClick}>Edit</button>
  ),
  DeleteButton: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="delete-button" onClick={onClick}>Delete</button>
  ),
}));

jest.mock('lucide-react', () => ({
  Equal: ({ size, className }: { size: number; className?: string }) => (
    <svg data-testid="equal-icon" width={size} height={size} className={className} />
  ),
  ArrowUp: ({ size, className }: { size: number; className?: string }) => (
    <svg data-testid="arrow-up-icon" width={size} height={size} className={className} />
  ),
  ArrowDown: ({ size, className }: { size: number; className?: string }) => (
    <svg data-testid="arrow-down-icon" width={size} height={size} className={className} />
  ),
}));

describe('MobileBudgetCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the budget card with correct structure', () => {
    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.getByText('Spent')).toBeInTheDocument();
    expect(screen.getByText('Remaining')).toBeInTheDocument();
    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('displays correct budget amount', () => {
    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('displays correct spent amount', () => {
    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const spentElements = screen.getAllByText('$50.00');
    expect(spentElements).toHaveLength(2);
  });

  it('displays correct remaining amount', () => {
    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const remainingElement = screen.getByText('$50.00', { selector: '.text-green-500' });
    expect(remainingElement).toBeInTheDocument();
  });

  it('shows arrow down icon when remaining budget is positive', () => {
    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-up-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('equal-icon')).not.toBeInTheDocument();
  });

  it('shows equal icon when remaining budget is zero', () => {
    const budgetWithExactSpending: Budget = {
      ...mockBudget,
      amount: 5000
    };

    render(
      <MobileBudgetCard
        budget={budgetWithExactSpending}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('equal-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-up-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('arrow-down-icon')).not.toBeInTheDocument();
  });

  it('shows arrow up icon when remaining budget is negative', () => {
    const budgetWithOverspending: Budget = {
      ...mockBudget,
      amount: 2000
    };

    render(
      <MobileBudgetCard
        budget={budgetWithOverspending}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('arrow-up-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-down-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('equal-icon')).not.toBeInTheDocument();
  });

  it('applies correct color classes to remaining amount', () => {
    const budgetWithOverspending: Budget = {
      ...mockBudget,
      amount: 2000
    };

    render(
      <MobileBudgetCard
        budget={budgetWithOverspending}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const remainingElement = screen.getByText('-$30.00');
    expect(remainingElement).toHaveClass('text-red-500');
  });

  it('applies correct color classes to remaining amount when positive', () => {
    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const remainingElement = screen.getByText('$50.00', { selector: '.text-green-500' });
    expect(remainingElement).toHaveClass('text-green-500');
  });

  it('applies correct color classes to remaining amount when zero', () => {
    const budgetWithExactSpending: Budget = {
      ...mockBudget,
      amount: 5000
    };

    render(
      <MobileBudgetCard
        budget={budgetWithExactSpending}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const remainingElement = screen.getByText('$0.00');
    expect(remainingElement).toHaveClass('text-yellow-500');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBudget);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('handles budget with no expenses', () => {
    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$100.00', { selector: '.text-lg' })).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('$100.00', { selector: '.text-green-500' })).toBeInTheDocument();
    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
  });

  it('handles budget with expenses from different categories', () => {
    const expensesFromDifferentCategory: CashFlowEntry[] = [
      {
        id: 1,
        amount: 3000,
        date: '2023-01-15',
        categoryId: 'different-category',
        description: 'Different category expense',
        entryType: 'Expense'
      }
    ];

    render(
      <MobileBudgetCard
        budget={mockBudget}
        expenses={expensesFromDifferentCategory}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$100.00', { selector: '.text-lg' })).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('$100.00', { selector: '.text-green-500' })).toBeInTheDocument();
  });

  it('handles budget without category name', () => {
    const budgetWithoutCategory: Budget = {
      ...mockBudget,
      category: undefined
    };

    render(
      <MobileBudgetCard
        budget={budgetWithoutCategory}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.getByText('Spent')).toBeInTheDocument();
    expect(screen.getByText('Remaining')).toBeInTheDocument();
  });

  it('handles budget with null category', () => {
    const budgetWithNullCategory: Budget = {
      ...mockBudget,
      category: undefined
    };

    render(
      <MobileBudgetCard
        budget={budgetWithNullCategory}
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.getByText('Spent')).toBeInTheDocument();
    expect(screen.getByText('Remaining')).toBeInTheDocument();
  });
}); 