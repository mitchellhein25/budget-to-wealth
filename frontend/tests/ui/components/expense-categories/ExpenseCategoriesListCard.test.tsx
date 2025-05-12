import { render, screen } from '@testing-library/react';
import ExpenseCategoriesListCard from '@/app/ui/components/expense-categories/ExpenseCategoriesListCard';
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';

describe('ExpenseCategoriesListCard', () => {
  it('renders the category name', () => {
    const item: ExpenseCategory = { id: 1, name: 'Food' };
    render(<ExpenseCategoriesListCard item={item} />);
    expect(screen.getByText('Food')).toBeInTheDocument();
  });
});
