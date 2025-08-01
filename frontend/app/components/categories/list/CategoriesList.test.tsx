import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
      <div data-testid="table-content">
        {items?.map((item: any, index: number) => {
          const rowElement = bodyRow(item);
          return (
            <div key={index} data-testid={`item-${index}`}>
              <div data-testid={`item-name-${index}`}>
                {item.name}
              </div>
              <div data-testid={`item-actions-${index}`}>
                {rowElement.props.children[1].props.children}
              </div>
            </div>
          );
        })}
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

  it('displays category names correctly', () => {
    render(<CategoriesList {...defaultProps} />);
    expect(screen.getByTestId('item-name-0')).toHaveTextContent('Category 1');
    expect(screen.getByTestId('item-name-1')).toHaveTextContent('Category 2');
    expect(screen.getByTestId('item-name-2')).toHaveTextContent('Category 3');
  });

  it('renders edit and delete buttons for each category', () => {
    render(<CategoriesList {...defaultProps} />);
    const editButtons = screen.getAllByLabelText('Edit');
    const deleteButtons = screen.getAllByLabelText('Delete');
    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('calls onCategoryDeleted when delete is successful', async () => {
    mockDeleteRequest.mockResolvedValue({ successful: true });
    
    render(<CategoriesList {...defaultProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockDeleteRequest).toHaveBeenCalledWith('/api/test-categories', 1);
      expect(mockOnCategoryDeleted).toHaveBeenCalled();
    });
  });

  it('does not call onCategoryDeleted when delete is unsuccessful', async () => {
    mockDeleteRequest.mockResolvedValue({ successful: false });
    
    render(<CategoriesList {...defaultProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockDeleteRequest).toHaveBeenCalledWith('/api/test-categories', 1);
      expect(mockOnCategoryDeleted).not.toHaveBeenCalled();
    });
  });

  it('calls onCategoryIsEditing when edit button is clicked', () => {
    render(<CategoriesList {...defaultProps} />);
    
    const editButtons = screen.getAllByLabelText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(mockOnCategoryIsEditing).toHaveBeenCalledWith(mockCategories[0]);
  });
}); 