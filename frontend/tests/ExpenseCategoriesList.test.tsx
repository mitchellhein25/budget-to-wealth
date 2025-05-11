import { render, screen, waitFor } from '@testing-library/react';
import ExpenseCategoriesList from '@/app/ui/components/expense-categories/ExpenseCategoriesList';
import * as expenseHook from '@/app/lib/api/expense-categories/getExpenseCategories';

jest.mock('@/hooks/useExpenseCategories');

const mockUseExpenseCategories = expenseHook.useExpenseCategories as jest.Mock;

describe('ExpenseCategoriesList', () => {
  it('renders list of categories correctly', async () => {
    mockUseExpenseCategories.mockResolvedValue([
      { id: 1, name: 'Food' },
      { id: 2, name: 'Utilities' },
    ]);

    const component = await ExpenseCategoriesList()
    render(component);

    await waitFor(() => {
      expect(screen.getByText('Expense Categories')).toBeInTheDocument();
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Utilities')).toBeInTheDocument();
    });
  });

  it('renders empty state message when no categories exist', async () => {
    mockUseExpenseCategories.mockResolvedValue([]);

    const component = await ExpenseCategoriesList()
    render(component);

    expect(screen.getByText('No Categories Found')).toBeInTheDocument();
    expect(
      screen.getByText("You haven’t added any expense categories yet.")
    ).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    mockUseExpenseCategories.mockRejectedValue(new Error('Internal Server Error'));

    const component = await ExpenseCategoriesList()
    render(component);

    expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
    expect(screen.getByText(/Internal Server Error/)).toBeInTheDocument();
  });
});
