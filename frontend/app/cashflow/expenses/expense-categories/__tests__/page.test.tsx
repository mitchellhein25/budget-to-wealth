import { render, screen, act } from '@testing-library/react';
import { ExpenseCategoriesPage } from '@/app/cashflow/expenses/expense-categories/page';

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

jest.mock('@/app/hooks', () => ({
  useParentPath: () => '/cashflow/expenses',
}));

jest.mock('@/app/lib/api', () => ({
  getRequestList: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
}));

describe('ExpenseCategoriesPage', () => {
  it('renders the page', async () => {
    await act(async () => {
      render(<ExpenseCategoriesPage />);
    });
    expect(screen.getByText('Expense Categories')).toBeInTheDocument();
  });
}); 