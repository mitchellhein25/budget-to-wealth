import React from 'react';
import { render, screen } from '@testing-library/react';
import { CategoriesList } from '@/app/components/categories/list/CategoriesList';
import { Category } from '@/app/components';

const listTableTestId = 'list-table';
const titleTestId = 'title';
const itemsCountTestId = 'items-count';
const isErrorTestId = 'is-error';
const isLoadingTestId = 'is-loading';

jest.mock('@/app/lib/api/rest-methods/deleteRequest', () => ({
  deleteRequest: jest.fn(() => Promise.resolve({ successful: true })),
}));

jest.mock('@/app/components', () => ({
  ListTable: ({ title, items, isError, isLoading }: { 
    title: string; 
    headerRow: React.ReactElement; 
    bodyRow: (item: unknown) => React.ReactElement; 
    mobileRow: (item: unknown) => React.ReactElement;
    items: Category[]; 
    isError: boolean; 
    isLoading: boolean; 
  }) => (
    <div data-testid={listTableTestId}>
      <div data-testid={titleTestId}>{title}</div>
      <div data-testid={itemsCountTestId}>{items?.length || 0}</div>
      <div data-testid={isErrorTestId}>{isError.toString()}</div>
      <div data-testid={isLoadingTestId}>{isLoading.toString()}</div>
      <div data-testid="table-content">
        {items?.map((item: Category, index: number) => (
          <div key={index} data-testid={`item-${index}`}>
            <div data-testid={`item-name-${index}`}>{item.name}</div>
            <div data-testid={`item-actions-${index}`}>
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  DesktopCategoryRow: () => <div>DesktopCategoryRow</div>,
  MobileCategoryCard: () => <div>MobileCategoryCard</div>,
}));

describe('CategoriesList', () => {
  const mockCategories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
  ];


  const mockOnCategoryDeleted = jest.fn();
  const mockOnCategoryIsEditing = jest.fn();

  const defaultProps = {
    categories: mockCategories,
    categoryTypeName: 'Test',
    deleteEndpoint: '/api/test-categories',
    onCategoryDeleted: mockOnCategoryDeleted,
    onCategoryIsEditing: mockOnCategoryIsEditing,
    isLoading: false,
    isError: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<CategoriesList {...defaultProps} />);
    expect(screen.getByTestId(listTableTestId)).toBeInTheDocument();
  });

  it('displays correct title with category type name', () => {
    render(<CategoriesList {...defaultProps} />);
    expect(screen.getByTestId(titleTestId)).toHaveTextContent('Test Categories');
  });

  it('displays correct number of items', () => {
    render(<CategoriesList {...defaultProps} />);
    expect(screen.getByTestId(itemsCountTestId)).toHaveTextContent('3');
  });

  it('handles empty categories array', () => {
    const emptyProps = {
      ...defaultProps,
      categories: [],
    };
    render(<CategoriesList {...emptyProps} />);
    expect(screen.getByTestId(itemsCountTestId)).toHaveTextContent('0');
  });

  it('handles loading state', () => {
    const loadingProps = {
      ...defaultProps,
      isLoading: true,
    };
    render(<CategoriesList {...loadingProps} />);
    expect(screen.getByTestId(isLoadingTestId)).toHaveTextContent('true');
  });

  it('handles error state', () => {
    const errorProps = {
      ...defaultProps,
      isError: true,
    };
    render(<CategoriesList {...errorProps} />);
    expect(screen.getByTestId(isErrorTestId)).toHaveTextContent('true');
  });

  it('displays category names correctly', () => {
    render(<CategoriesList {...defaultProps} />);
    expect(screen.getByTestId('item-name-0')).toHaveTextContent('Category 1');
    expect(screen.getByTestId('item-name-1')).toHaveTextContent('Category 2');
    expect(screen.getByTestId('item-name-2')).toHaveTextContent('Category 3');
  });

  it('renders edit and delete buttons for each category', () => {
    render(<CategoriesList {...defaultProps} />);
    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');
    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });


}); 