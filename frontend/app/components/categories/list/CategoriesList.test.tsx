import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategoriesList } from './CategoriesList';

const listTableTestId = 'list-table';
const listTableText = 'List Table';
const titleTestId = 'title';
const itemsCountTestId = 'items-count';
const isErrorTestId = 'is-error';
const isLoadingTestId = 'is-loading';
const editButtonTestId = 'edit-button';
const deleteButtonTestId = 'delete-button';

jest.mock('@/app/components/table/ListTable', () => ({
  __esModule: true,
  ListTable: ({ title, headerRow, bodyRow, items, isError, isLoading }: any) => (
    <div data-testid={listTableTestId}>
      <div>{listTableText}</div>
      <div data-testid={titleTestId}>{title}</div>
      <div data-testid={itemsCountTestId}>{items?.length || 0}</div>
      <div data-testid={isErrorTestId}>{isError.toString()}</div>
      <div data-testid={isLoadingTestId}>{isLoading.toString()}</div>
      <div data-testid="table-content">
        {items?.map((item: any, index: number) => (
          <div key={index} data-testid={`item-${index}`}>
            {bodyRow(item)}
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('@/app/lib/api/rest-methods/deleteRequest', () => ({
  deleteRequest: jest.fn(),
}));

describe('CategoriesList', () => {
  const mockCategories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
  ];

  const mockDeleteRequest = require('@/app/lib/api/rest-methods/deleteRequest').deleteRequest as jest.MockedFunction<any>;
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
    expect(screen.getByText(listTableText)).toBeInTheDocument();
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

  it('displays category names in table rows', () => {
    render(<CategoriesList {...defaultProps} />);
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByText('Category 3')).toBeInTheDocument();
  });

  it('calls onCategoryIsEditing when edit button is clicked', () => {
    render(<CategoriesList {...defaultProps} />);
    
    const editButtons = screen.getAllByLabelText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(mockOnCategoryIsEditing).toHaveBeenCalledWith(mockCategories[0]);
  });

  it('calls deleteRequest when delete button is clicked', async () => {
    mockDeleteRequest.mockResolvedValue({ successful: true });
    
    render(<CategoriesList {...defaultProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockDeleteRequest).toHaveBeenCalledWith('/api/test-categories', 1);
    });
  });

  it('calls onCategoryDeleted when delete is successful', async () => {
    mockDeleteRequest.mockResolvedValue({ successful: true });
    
    render(<CategoriesList {...defaultProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockOnCategoryDeleted).toHaveBeenCalled();
    });
  });

  it('does not call onCategoryDeleted when delete fails', async () => {
    mockDeleteRequest.mockResolvedValue({ successful: false });
    
    render(<CategoriesList {...defaultProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockDeleteRequest).toHaveBeenCalledWith('/api/test-categories', 1);
    });
    
    expect(mockOnCategoryDeleted).not.toHaveBeenCalled();
  });

  it('handles different category types', () => {
    const expenseProps = {
      ...defaultProps,
      categoryTypeName: 'Expense',
    };
    render(<CategoriesList {...expenseProps} />);
    expect(screen.getByTestId(titleTestId)).toHaveTextContent('Expense Categories');
  });

  it('handles income category type', () => {
    const incomeProps = {
      ...defaultProps,
      categoryTypeName: 'Income',
    };
    render(<CategoriesList {...incomeProps} />);
    expect(screen.getByTestId(titleTestId)).toHaveTextContent('Income Categories');
  });

  it('handles categories with different IDs', () => {
    const categoriesWithDifferentIds = [
      { id: 10, name: 'Category A' },
      { id: 20, name: 'Category B' },
      { id: 30, name: 'Category C' },
    ];
    
    const propsWithDifferentIds = {
      ...defaultProps,
      categories: categoriesWithDifferentIds,
    };
    
    render(<CategoriesList {...propsWithDifferentIds} />);
    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('Category B')).toBeInTheDocument();
    expect(screen.getByText('Category C')).toBeInTheDocument();
  });

  it('handles single category', () => {
    const singleCategoryProps = {
      ...defaultProps,
      categories: [{ id: 1, name: 'Single Category' }],
    };
    render(<CategoriesList {...singleCategoryProps} />);
    expect(screen.getByText('Single Category')).toBeInTheDocument();
    expect(screen.getByTestId(itemsCountTestId)).toHaveTextContent('1');
  });

  it('handles different delete endpoints', () => {
    const customEndpointProps = {
      ...defaultProps,
      deleteEndpoint: '/api/custom-categories',
    };
    render(<CategoriesList {...customEndpointProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockDeleteRequest).toHaveBeenCalledWith('/api/custom-categories', 1);
  });
}); 