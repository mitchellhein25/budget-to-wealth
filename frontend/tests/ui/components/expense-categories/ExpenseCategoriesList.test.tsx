import { render, screen, waitFor } from '@testing-library/react';
import ExpenseCategoriesList from '@/app/ui/components/expense-categories/ExpenseCategoriesList';
import * as expenseHook from '@/app/lib/api/expense-categories/getExpenseCategories';

jest.mock('@/app/lib/api/expense-categories/getExpenseCategories');

const mockGetExpenseCategories = expenseHook.getExpenseCategories as jest.Mock;

describe('ExpenseCategoriesList', () => {
  it('renders list of categories correctly', async () => {
    mockGetExpenseCategories.mockResolvedValue({
      data: [
        { id: 1, name: 'Food' },
        { id: 2, name: 'Utilities' },
      ],
      responseMessage: '',
      successful: true
    });

    const component = await ExpenseCategoriesList()
    render(component);

    await waitFor(() => {
      expect(screen.getByText('Expense Categories')).toBeInTheDocument();
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Utilities')).toBeInTheDocument();
    });
  });

  it('renders empty state message when no categories exist', async () => {
    mockGetExpenseCategories.mockResolvedValue({
      data: [],
      responseMessage: '',
      successful: true
    }); 

    const component = await ExpenseCategoriesList()
    render(component);
    await waitFor(() => {
      expect(screen.getByText('No Expense Categories Found')).toBeInTheDocument();
      expect(
        screen.getByText("You haven’t added any Expense Categories yet.")
      ).toBeInTheDocument();
    });
  });

  it('renders error message when fetch fails', async () => {
    mockGetExpenseCategories.mockResolvedValue({
      data: [],
      responseMessage: 'Internal Server Error',
      successful: false
    });

    const component = await ExpenseCategoriesList()
    render(component);

    await waitFor(() => {
      expect(screen.getByText('Failed to load expense categories')).toBeInTheDocument();
      expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
    });
  });
});
