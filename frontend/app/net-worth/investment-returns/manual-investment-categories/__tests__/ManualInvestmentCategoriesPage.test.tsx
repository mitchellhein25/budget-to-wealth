import React from 'react';
import { render, screen } from '@testing-library/react';
import ManualInvestmentCategoriesPage from '@/app/net-worth/investment-returns/manual-investment-categories/page';

const categoriesPageTestId = 'categories-page';
const categoriesPageText = 'Categories Page';

jest.mock('@/app/components', () => ({
  CategoriesPage: ({ 
    isLoggedIn, 
    categoryTypeName, 
    getEndpoint, 
    createUpdateDeleteEndpoint 
  }: { 
    isLoggedIn: boolean; 
    categoryTypeName: string; 
    getEndpoint: string; 
    createUpdateDeleteEndpoint: string; 
  }) => (
    <div data-testid={categoriesPageTestId}
         data-is-logged-in={isLoggedIn}
         data-category-type={categoryTypeName}
         data-get-endpoint={getEndpoint}
         data-create-endpoint={createUpdateDeleteEndpoint}>
      {categoriesPageText}
    </div>
  ),
}));

describe('ManualInvestmentCategories', () => {
  it('renders CategoriesPage with correct props', () => {
    render(<ManualInvestmentCategoriesPage />);
    
    const categoriesPage = screen.getByTestId(categoriesPageTestId);
    expect(categoriesPage).toBeInTheDocument();
    expect(categoriesPage).toHaveAttribute('data-is-logged-in', 'true');
    expect(categoriesPage).toHaveAttribute('data-category-type', 'Manual Investment');
    expect(categoriesPage).toHaveAttribute('data-get-endpoint', 'ManualInvestmentCategories');
    expect(categoriesPage).toHaveAttribute('data-create-endpoint', 'ManualInvestmentCategories');
  });

  it('renders with correct content', () => {
    render(<ManualInvestmentCategoriesPage />);
    
    expect(screen.getByText(categoriesPageText)).toBeInTheDocument();
  });
});
