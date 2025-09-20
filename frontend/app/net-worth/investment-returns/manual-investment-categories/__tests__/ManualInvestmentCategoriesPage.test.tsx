import React from 'react';
import { render, screen } from '@testing-library/react';
import ManualInvestmentCategoriesPage from '@/app/net-worth/investment-returns/manual-investment-categories/page';

const categoriesPageTestId = 'categories-page';
const categoriesPageText = 'Categories Page';
const backArrowTestId = 'back-arrow';

jest.mock('@/app/hooks', () => ({
  useParentPath: jest.fn(() => '/parent-path'),
}));

jest.mock('@/app/components', () => ({
  CategoriesPage: ({
    categoryTypeName,
    getEndpoint,
    createUpdateDeleteEndpoint
  }: {
    categoryTypeName: string;
    getEndpoint: string;
    createUpdateDeleteEndpoint: string;
  }) => (
    <div data-testid={categoriesPageTestId}
      data-category-type={categoryTypeName}
      data-get-endpoint={getEndpoint}
      data-create-endpoint={createUpdateDeleteEndpoint}>
      {categoriesPageText}
    </div>
  ),
  BackArrow: ({ link }: { link: string }) => (
    <div data-testid={backArrowTestId} data-link={link}>
      Back Arrow
    </div>
  ),
}));

describe('ManualInvestmentCategories', () => {
  it('renders CategoriesPage with correct props', () => {
    render(<ManualInvestmentCategoriesPage />);

    const categoriesPage = screen.getByTestId(categoriesPageTestId);
    expect(categoriesPage).toBeInTheDocument();
    expect(categoriesPage).toHaveAttribute('data-category-type', 'Manual Investment');
    expect(categoriesPage).toHaveAttribute('data-get-endpoint', 'ManualInvestmentCategories');
    expect(categoriesPage).toHaveAttribute('data-create-endpoint', 'ManualInvestmentCategories');
  });

  it('renders BackArrow with correct props', () => {
    render(<ManualInvestmentCategoriesPage />);

    const backArrow = screen.getByTestId(backArrowTestId);
    expect(backArrow).toBeInTheDocument();
    expect(backArrow).toHaveAttribute('data-link', '/parent-path');
  });

  it('renders with correct content', () => {
    render(<ManualInvestmentCategoriesPage />);

    expect(screen.getByText(categoriesPageText)).toBeInTheDocument();
    expect(screen.getByText('Back Arrow')).toBeInTheDocument();
  });
});
