import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import IncomeCategories from './page';
import { BACK_ARROW_TEXT } from '@/app/components/buttons/BackArrow';
import { INCOME_ITEM_NAME } from '@/app/cashflow/components/constants';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockParentPath = '/cashflow/income';
const categoriesPageTestId = 'categories-page';

jest.mock('@/app/hooks', () => ({
  useParentPath: () => mockParentPath,
}));

jest.mock('@/app/components/categories/CategoriesPage', () => {
  return function MockCategoriesPage() {
    return <div data-testid={categoriesPageTestId}>Categories Page</div>;
  };
});

describe('IncomeCategories', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the page correctly', () => {
    render(<IncomeCategories />);
    
    expect(screen.getByText(BACK_ARROW_TEXT)).toBeInTheDocument();
    expect(screen.getByTestId(categoriesPageTestId)).toBeInTheDocument();
  });

  it('renders back arrow with correct link', () => {
    render(<IncomeCategories />);
    
    const backButton = screen.getByText(BACK_ARROW_TEXT);
    expect(backButton).toBeInTheDocument();
    
    const backLink = backButton.closest('[href]');
    expect(backLink).toHaveAttribute('href', mockParentPath);
  });
}); 