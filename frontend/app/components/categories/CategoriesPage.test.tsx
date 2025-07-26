import { render, screen } from '@testing-library/react';
import { CategoriesPage } from './CategoriesPage';

const categoriesFormTestId = 'categories-form';
const categoriesListTestId = 'categories-list';
const categoriesFormText = 'Categories Form';
const categoriesListText = 'Categories List';

jest.mock('@/app/hooks', () => ({
  useDataListFetcher: () => ({
    items: [],
    isLoading: false,
    message: null,
    fetchItems: jest.fn(),
  }),
  useForm: () => ({
    formData: {},
    onInputChange: jest.fn(),
    onSubmit: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: null,
  }),
}));

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
  getRequestList: jest.fn(),
}));

jest.mock('./form/CategoriesForm', () => ({
  __esModule: true,
  CategoriesForm: ({ formState, categoryTypeName }: any) => (
    <div data-testid={categoriesFormTestId}>
      <div>{categoriesFormText}</div>
      <div data-testid="form-category-type-name">{categoryTypeName}</div>
    </div>
  ),
}));

jest.mock('./list/CategoriesList', () => ({
  __esModule: true,
  CategoriesList: ({ categories, categoryTypeName, deleteEndpoint }: any) => (
    <div data-testid={categoriesListTestId}>
      <div>{categoriesListText}</div>
      <div data-testid="list-category-type-name">{categoryTypeName}</div>
      <div data-testid="delete-endpoint">{deleteEndpoint}</div>
    </div>
  ),
}));

jest.mock('../Utils', () => ({
  messageTypeIsError: jest.fn(() => false),
}));

describe('CategoriesPage', () => {
  const mockProps = {
    isLoggedIn: true,
    categoryTypeName: 'Test',
    getEndpoint: '/api/test-categories',
    createUpdateDeleteEndpoint: '/api/test-categories',
  };

  it('renders the page correctly', () => {
    render(<CategoriesPage {...mockProps} />);
    expect(screen.getByTestId(categoriesFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(categoriesListTestId)).toBeInTheDocument();
  });

  it('renders all main components with correct content', () => {
    render(<CategoriesPage {...mockProps} />);
    expect(screen.getByText(categoriesFormText)).toBeInTheDocument();
    expect(screen.getByText(categoriesListText)).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    render(<CategoriesPage {...mockProps} />);
    expect(screen.getByTestId('form-category-type-name')).toHaveTextContent(mockProps.categoryTypeName);
    expect(screen.getByTestId('list-category-type-name')).toHaveTextContent(mockProps.categoryTypeName);
    expect(screen.getByTestId('delete-endpoint')).toHaveTextContent(mockProps.createUpdateDeleteEndpoint);
  });

  it('handles different category types', () => {
    const expenseProps = {
      ...mockProps,
      categoryTypeName: 'Expense',
    };
    render(<CategoriesPage {...expenseProps} />);
    expect(screen.getByTestId('form-category-type-name')).toHaveTextContent('Expense');
    expect(screen.getByTestId('list-category-type-name')).toHaveTextContent('Expense');
  });
}); 