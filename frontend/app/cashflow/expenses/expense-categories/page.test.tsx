import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ExpenseCategories from './page';
import { BACK_ARROW_TEXT } from '@/app/components/buttons/BackArrow';
import { EXPENSE_ITEM_NAME } from '@/app/cashflow/components/constants';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: () => new URLSearchParams(),
}));

const mockParentPath = '/cashflow/expenses';
const categoriesPageTestId = 'categories-page';

jest.mock('@/app/hooks', () => ({
  useParentPath: () => mockParentPath,
}));

jest.mock('@/app/components/categories/CategoriesPage', () => {
  return function MockCategoriesPage() {
    return <div data-testid={categoriesPageTestId}>Categories Page</div>;
  };
});

describe('ExpenseCategories', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the page correctly', () => {
    render(<ExpenseCategories />);
    
    expect(screen.getByText(BACK_ARROW_TEXT)).toBeInTheDocument();
    expect(screen.getByTestId(categoriesPageTestId)).toBeInTheDocument();
  });

  it('renders back arrow with correct link', () => {
    render(<ExpenseCategories />);
    
    const backButton = screen.getByText(BACK_ARROW_TEXT);
    expect(backButton).toBeInTheDocument();
    
    const backLink = backButton.closest('[href]');
    expect(backLink).toHaveAttribute('href', mockParentPath);
  });
}); 