import { render, screen } from '@testing-library/react';
import ExpenseCategoriesPage from './page';

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

jest.mock('@/app/hooks/useParentPath', () => ({
  useParentPath: () => '/cashflow/expenses',
}));

describe('ExpenseCategoriesPage', () => {
  it('renders the page', () => {
    render(<ExpenseCategoriesPage />);
    expect(screen.getByText('Expense Categories')).toBeInTheDocument();
  });
}); 