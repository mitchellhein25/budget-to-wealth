import { render, screen, act } from '@testing-library/react';
import { IncomeCategoriesPage } from '@/app/cashflow/income/income-categories/page';

jest.mock('@/app/lib/api', () => ({
  getRequestList: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
}));

describe('IncomeCategoriesPage', () => {
  it('renders the page', async () => {
    await act(async () => {
      render(<IncomeCategoriesPage />);
    });
    expect(screen.getByText('Income Categories')).toBeInTheDocument();
  });
}); 