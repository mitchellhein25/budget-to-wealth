import { render, screen, act } from '@testing-library/react';
import ExpenseCategoriesPage from './page';

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

jest.mock('@/app/hooks/useParentPath', () => ({
  useParentPath: () => '/cashflow/expenses',
}));

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
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