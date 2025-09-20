import React from 'react';
import { render, screen } from '@testing-library/react';
import HoldingCategoriesPage from '@/app/net-worth/holding-snapshots/holdings/holding-categories/page';

jest.mock('@/app/hooks', () => ({
  useParentPath: () => '/net-worth/holdings',
}));

jest.mock('@/app/components', () => ({
  BackArrow: ({ link }: { link: string }) => <div data-testid="back-arrow" data-link={link}>Back Arrow</div>,
CategoriesPage: ({ 
    categoryTypeName, 
    getEndpoint, 
    createUpdateDeleteEndpoint 
  }: { 
    isLoggedIn: boolean; 
    categoryTypeName: string; 
    getEndpoint: string; 
    createUpdateDeleteEndpoint: string; 
  }) => (
    <div data-testid="categories-page" 
         data-category-type={categoryTypeName}
         data-get-endpoint={getEndpoint}
         data-create-endpoint={createUpdateDeleteEndpoint}>
      Categories Page
    </div>
  ),
}));

describe('Holding Categories Page', () => {
  it('renders with correct props', () => {
    const PageComponent = HoldingCategoriesPage();
    render(PageComponent);
    
    expect(screen.getByTestId('back-arrow')).toBeInTheDocument();
    expect(screen.getByTestId('categories-page')).toBeInTheDocument();
    
    const backArrow = screen.getByTestId('back-arrow');
    expect(backArrow).toHaveAttribute('data-link', '/net-worth/holdings');
    
    const categoriesPage = screen.getByTestId('categories-page');
    expect(categoriesPage).toHaveAttribute('data-category-type', 'Holding');
    expect(categoriesPage).toHaveAttribute('data-get-endpoint', 'HoldingCategories');
    expect(categoriesPage).toHaveAttribute('data-create-endpoint', 'HoldingCategories');
  });
});
