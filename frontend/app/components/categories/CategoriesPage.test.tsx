import { render, screen } from '@testing-library/react';
import { CategoriesPage } from './CategoriesPage';
import { useDataListFetcher, useForm } from '@/app/hooks';
import { getRequestList } from '@/app/lib/api/rest-methods/getRequest';
import { messageTypeIsError } from '../Utils';

const categoriesFormTestId = 'categories-form';
const categoriesListTestId = 'categories-list';
const categoriesFormText = 'Categories Form';
const categoriesListText = 'Categories List';

jest.mock('@/app/hooks', () => ({
  useDataListFetcher: jest.fn(),
  useForm: jest.fn(),
}));

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
  getRequestList: jest.fn(),
}));

jest.mock('./form/CategoriesForm', () => ({
  __esModule: true,
  CategoriesForm: ({ categoryTypeName }: { formState: unknown; categoryTypeName: string }) => (
    <div data-testid={categoriesFormTestId}>
      <div>{categoriesFormText}</div>
      <div data-testid="form-category-type-name">{categoryTypeName}</div>
    </div>
  ),
}));

jest.mock('./list/CategoriesList', () => ({
  __esModule: true,
  CategoriesList: ({ categoryTypeName, deleteEndpoint, isLoading, isError }: { 
    categories: unknown[]; 
    categoryTypeName: string; 
    deleteEndpoint: string; 
    isLoading: boolean; 
    isError: boolean; 
  }) => (
    <div data-testid={categoriesListTestId}>
      <div>{categoriesListText}</div>
      <div data-testid="list-category-type-name">{categoryTypeName}</div>
      <div data-testid="delete-endpoint">{deleteEndpoint}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <div data-testid="is-error">{isError.toString()}</div>
    </div>
  ),
}));

jest.mock('../Utils', () => ({
  messageTypeIsError: jest.fn(),
}));

describe('CategoriesPage', () => {
  const mockUseDataListFetcher = jest.mocked(useDataListFetcher);
  const mockUseForm = jest.mocked(useForm);
  const mockGetRequestList = jest.mocked(getRequestList);
  const mockMessageTypeIsError = jest.mocked(messageTypeIsError);

  const mockProps = {
    isLoggedIn: true,
    categoryTypeName: 'Test',
    getEndpoint: '/api/test-categories',
    createUpdateDeleteEndpoint: '/api/test-categories',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: null,
      fetchItems: jest.fn(),
    });
    
    mockUseForm.mockReturnValue({
      formData: {},
      onInputChange: jest.fn(),
      onSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      isSubmitting: false,
      message: null,
    });
    
    mockMessageTypeIsError.mockReturnValue(false);
  });

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

  it('handles income category type', () => {
    const incomeProps = {
      ...mockProps,
      categoryTypeName: 'Income',
    };
    render(<CategoriesPage {...incomeProps} />);
    expect(screen.getByTestId('form-category-type-name')).toHaveTextContent('Income');
    expect(screen.getByTestId('list-category-type-name')).toHaveTextContent('Income');
  });

  it('handles expense category type', () => {
    const expenseProps = {
      ...mockProps,
      categoryTypeName: 'Expense',
    };
    render(<CategoriesPage {...expenseProps} />);
    expect(screen.getByTestId('form-category-type-name')).toHaveTextContent('Expense');
    expect(screen.getByTestId('list-category-type-name')).toHaveTextContent('Expense');
  });

  it('handles loading state', () => {
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: true,
      message: null,
      fetchItems: jest.fn(),
    });

    render(<CategoriesPage {...mockProps} />);
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
  });

  it('handles error state', () => {
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: { type: 'error', text: 'Error message' },
      fetchItems: jest.fn(),
    });
    mockMessageTypeIsError.mockReturnValue(true);

    render(<CategoriesPage {...mockProps} />);
    expect(screen.getByTestId('is-error')).toHaveTextContent('true');
  });

  it('handles items with data', () => {
    const mockItems = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ];

    mockUseDataListFetcher.mockReturnValue({
      items: mockItems,
      isLoading: false,
      message: null,
      fetchItems: jest.fn(),
    });

    render(<CategoriesPage {...mockProps} />);
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('is-error')).toHaveTextContent('false');
  });

  it('calls fetchCategories on mount', () => {
    const mockFetchItems = jest.fn();
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: null,
      fetchItems: mockFetchItems,
    });

    render(<CategoriesPage {...mockProps} />);
    expect(mockGetRequestList).toHaveBeenCalledWith(mockProps.getEndpoint);
  });

  it('handles different endpoints', () => {
    const customProps = {
      ...mockProps,
      getEndpoint: '/api/custom-categories',
      createUpdateDeleteEndpoint: '/api/custom-categories',
    };

    render(<CategoriesPage {...customProps} />);
    expect(mockGetRequestList).toHaveBeenCalledWith('/api/custom-categories');
    expect(screen.getByTestId('delete-endpoint')).toHaveTextContent('/api/custom-categories');
  });

  it('tests transformFormDataToCategory with Income category type', () => {
    const incomeProps = {
      ...mockProps,
      categoryTypeName: 'Income',
    };

    const mockTransformFormDataToItem = jest.fn();
    mockUseForm.mockReturnValue({
      formData: {},
      onInputChange: jest.fn(),
      onSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      isSubmitting: false,
      message: null,
      transformFormDataToItem: mockTransformFormDataToItem,
    });

    render(<CategoriesPage {...incomeProps} />);
    
    expect(mockUseForm).toHaveBeenCalledWith({
      itemName: 'Income',
      itemEndpoint: '/api/test-categories',
      transformFormDataToItem: expect.any(Function),
      convertItemToFormData: expect.any(Function),
      fetchItems: expect.any(Function),
    });
  });

  it('tests transformFormDataToCategory with Expense category type', () => {
    const expenseProps = {
      ...mockProps,
      categoryTypeName: 'Expense',
    };

    const mockTransformFormDataToItem = jest.fn();
    mockUseForm.mockReturnValue({
      formData: {},
      onInputChange: jest.fn(),
      onSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      isSubmitting: false,
      message: null,
      transformFormDataToItem: mockTransformFormDataToItem,
    });

    render(<CategoriesPage {...expenseProps} />);
    
    expect(mockUseForm).toHaveBeenCalledWith({
      itemName: 'Expense',
      itemEndpoint: '/api/test-categories',
      transformFormDataToItem: expect.any(Function),
      convertItemToFormData: expect.any(Function),
      fetchItems: expect.any(Function),
    });
  });

  it('tests transformFormDataToCategory with other category type', () => {
    const otherProps = {
      ...mockProps,
      categoryTypeName: 'Other',
    };

    const mockTransformFormDataToItem = jest.fn();
    mockUseForm.mockReturnValue({
      formData: {},
      onInputChange: jest.fn(),
      onSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      isSubmitting: false,
      message: null,
      transformFormDataToItem: mockTransformFormDataToItem,
    });

    render(<CategoriesPage {...otherProps} />);
    
    expect(mockUseForm).toHaveBeenCalledWith({
      itemName: 'Other',
      itemEndpoint: '/api/test-categories',
      transformFormDataToItem: expect.any(Function),
      convertItemToFormData: expect.any(Function),
      fetchItems: expect.any(Function),
    });
  });

  it('tests convertCategoryToFormData function', () => {
    const mockConvertItemToFormData = jest.fn();
    mockUseForm.mockReturnValue({
      formData: {},
      onInputChange: jest.fn(),
      onSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      isSubmitting: false,
      message: null,
      convertItemToFormData: mockConvertItemToFormData,
    });

    render(<CategoriesPage {...mockProps} />);
    
    expect(mockUseForm).toHaveBeenCalledWith({
      itemName: 'Test',
      itemEndpoint: '/api/test-categories',
      transformFormDataToItem: expect.any(Function),
      convertItemToFormData: expect.any(Function),
      fetchItems: expect.any(Function),
    });
  });

  it('tests useEffect dependency on fetchCategories', () => {
    const mockFetchItems = jest.fn();
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: null,
      fetchItems: mockFetchItems,
    });

    render(<CategoriesPage {...mockProps} />);
    
    expect(mockGetRequestList).toHaveBeenCalledWith(mockProps.getEndpoint);
  });

  it('tests messageTypeIsError function call', () => {
    mockUseDataListFetcher.mockReturnValue({
      items: [],
      isLoading: false,
      message: { type: 'error', text: 'Error message' },
      fetchItems: jest.fn(),
    });
    mockMessageTypeIsError.mockReturnValue(true);

    render(<CategoriesPage {...mockProps} />);
    
    expect(mockMessageTypeIsError).toHaveBeenCalledWith({ type: 'error', text: 'Error message' });
    expect(screen.getByTestId('is-error')).toHaveTextContent('true');
  });

  it('tests transformFormDataToCategory function with Income category type', () => {
    const incomeProps = {
      ...mockProps,
      categoryTypeName: 'Income',
    };

    let capturedTransformFunction: (formData: FormData) => unknown;
    mockUseForm.mockImplementation((config: { transformFormDataToItem: (formData: FormData) => unknown }) => {
      capturedTransformFunction = config.transformFormDataToItem;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    render(<CategoriesPage {...incomeProps} />);
    
    const formData = new FormData();
    formData.append('Name', 'Test Income Category');
    
    const result = capturedTransformFunction(formData);
    
    expect(result.item.name).toBe('Test Income Category');
    expect(result.item.categoryType).toBe('Income');
    expect(result.errors).toEqual([]);
  });

  it('tests transformFormDataToCategory function with Expense category type', () => {
    const expenseProps = {
      ...mockProps,
      categoryTypeName: 'Expense',
    };

    let capturedTransformFunction: (formData: FormData) => unknown;
    mockUseForm.mockImplementation((config: { transformFormDataToItem: (formData: FormData) => unknown }) => {
      capturedTransformFunction = config.transformFormDataToItem;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    render(<CategoriesPage {...expenseProps} />);
    
    const formData = new FormData();
    formData.append('Name', 'Test Expense Category');
    
    const result = capturedTransformFunction(formData);
    
    expect(result.item.name).toBe('Test Expense Category');
    expect(result.item.categoryType).toBe('Expense');
    expect(result.errors).toEqual([]);
  });

  it('tests transformFormDataToCategory function with other category type', () => {
    const otherProps = {
      ...mockProps,
      categoryTypeName: 'Other',
    };

    let capturedTransformFunction: (formData: FormData) => unknown;
    mockUseForm.mockImplementation((config: { transformFormDataToItem: (formData: FormData) => unknown }) => {
      capturedTransformFunction = config.transformFormDataToItem;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    render(<CategoriesPage {...otherProps} />);
    
    const formData = new FormData();
    formData.append('Name', 'Test Other Category');
    
    const result = capturedTransformFunction(formData);
    
    expect(result.item.name).toBe('Test Other Category');
    expect(result.item.categoryType).toBeUndefined();
    expect(result.errors).toEqual([]);
  });

  it('tests convertCategoryToFormData function', () => {
    let capturedConvertFunction: (item: unknown) => FormData;
    mockUseForm.mockImplementation((config: { convertItemToFormData: (item: unknown) => FormData }) => {
      capturedConvertFunction = config.convertItemToFormData;
      return {
        formData: {},
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        isSubmitting: false,
        message: null,
      };
    });

    render(<CategoriesPage {...mockProps} />);
    
    const mockCategory = { id: 1, name: 'Test Category' };
    const result = capturedConvertFunction(mockCategory);
    
    expect(result).toEqual({ name: 'Test Category' });
  });
}); 