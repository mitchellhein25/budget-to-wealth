import { render, screen } from '@testing-library/react';
import { CategoriesList } from './CategoriesList';

const listTableTestId = 'list-table';
const listTableText = 'List Table';
const titleTestId = 'title';
const itemsCountTestId = 'items-count';
const isErrorTestId = 'is-error';
const isLoadingTestId = 'is-loading';

jest.mock('@/app/components/table/ListTable', () => ({
  __esModule: true,
  ListTable: ({ title, headerRow, bodyRow, items, isError, isLoading }: any) => (
    <div data-testid={listTableTestId}>
      <div>{listTableText}</div>
      <div data-testid={titleTestId}>{title}</div>
      <div data-testid={itemsCountTestId}>{items?.length || 0}</div>
      <div data-testid={isErrorTestId}>{isError.toString()}</div>
      <div data-testid={isLoadingTestId}>{isLoading.toString()}</div>
    </div>
  ),
}));

jest.mock('@/app/lib/api/rest-methods/deleteRequest', () => ({
  deleteRequest: jest.fn(),
}));

describe('CategoriesList', () => {
  const mockCategories = [
    { id: 1, name: 'Food', date: '2024-01-01' },
    { id: 2, name: 'Transport', date: '2024-01-01' },
  ] as any;

  const mockProps = {
    categories: mockCategories,
    categoryTypeName: 'Test',
    deleteEndpoint: '/api/test-categories',
    onCategoryDeleted: jest.fn(),
    onCategoryIsEditing: jest.fn(),
    isLoading: false,
    isError: false,
  };

  it('renders with correct title', () => {
    render(<CategoriesList {...mockProps} />);
    expect(screen.getByTestId(titleTestId)).toHaveTextContent(`${mockProps.categoryTypeName} Categories`);
  });

  it('passes correct props to ListTable', () => {
    render(<CategoriesList {...mockProps} />);
    expect(screen.getByTestId(listTableTestId)).toBeInTheDocument();
    expect(screen.getByTestId(itemsCountTestId)).toHaveTextContent('2');
    expect(screen.getByTestId(isErrorTestId)).toHaveTextContent('false');
    expect(screen.getByTestId(isLoadingTestId)).toHaveTextContent('false');
  });

  it('handles loading state', () => {
    render(<CategoriesList {...mockProps} isLoading={true} />);
    expect(screen.getByTestId(isLoadingTestId)).toHaveTextContent('true');
  });

  it('handles error state', () => {
    render(<CategoriesList {...mockProps} isError={true} />);
    expect(screen.getByTestId(isErrorTestId)).toHaveTextContent('true');
  });

  it('handles empty categories', () => {
    const propsWithNoCategories = {
      ...mockProps,
      categories: [],
    };
    render(<CategoriesList {...propsWithNoCategories} />);
    expect(screen.getByTestId(itemsCountTestId)).toHaveTextContent('0');
  });
}); 