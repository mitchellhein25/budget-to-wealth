import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HoldingCategories from './page';
import { BACK_ARROW_TEXT } from '@/app/components/buttons/BackArrow';
import { NET_WORTH_ITEM_NAME_LINK } from '@/app/net-worth/components';
import { HOLDING_CATEGORY_ITEM_NAME_PLURAL_LOWERCASE } from '../components';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockParentPath = `/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_CATEGORY_ITEM_NAME_PLURAL_LOWERCASE}`;
export const testingId = 'categories-page';

jest.mock('@/app/hooks', () => ({
  useParentPath: () => mockParentPath,
}));

jest.mock('@/app/components/categories/CategoriesPage', () => {
  return function MockCategoriesPage() {
    return <div data-testid={testingId}>Categories Page</div>;
  };
});

describe('HoldingCategories', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the page correctly', () => {
    render(<HoldingCategories />);
    
    expect(screen.getByText(BACK_ARROW_TEXT)).toBeInTheDocument();
    expect(screen.getByTestId(testingId)).toBeInTheDocument();
  });

  it('renders back arrow with correct link', () => {
    render(<HoldingCategories />);
    
    const backButton = screen.getByText(BACK_ARROW_TEXT);
    expect(backButton).toBeInTheDocument();
    
    const backLink = backButton.closest('[href]');
    expect(backLink).toHaveAttribute('href', mockParentPath);
  });
}); 