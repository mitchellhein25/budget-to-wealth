import { render, screen, waitFor, act } from '@testing-library/react';
import { CategoriesPage } from './CategoriesPage';
import { useForm } from '@/app/hooks';
import { getRequestList } from '@/app/lib/api/rest-methods/getRequest';
import { messageTypeIsError } from '../Utils';

const categoriesFormTestId = 'categories-form';
const categoriesListTestId = 'categories-list';
const categoriesFormText = 'Categories Form';
const categoriesListText = 'Categories List';

jest.mock('@/app/hooks', () => ({
  useForm: jest.fn(),
  useMobileDetection: jest.fn(),
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
    
    mockUseForm.mockReturnValue({
      formData: {},
      onInputChange: jest.fn(),
      onSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      isSubmitting: false,
      message: null,
    });
    
    mockGetRequestList.mockResolvedValue({
      successful: true,
      data: [],
    });
    
    mockMessageTypeIsError.mockReturnValue(false);
  });

  it('renders the page correctly', async () => {
    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    expect(screen.getByTestId(categoriesFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(categoriesListTestId)).toBeInTheDocument();
  });

  it('renders all main components with correct content', async () => {
    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    expect(screen.getByText(categoriesFormText)).toBeInTheDocument();
    expect(screen.getByText(categoriesListText)).toBeInTheDocument();
  });

  it('passes correct props to child components', async () => {
    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    expect(screen.getByTestId('form-category-type-name')).toHaveTextContent(mockProps.categoryTypeName);
    expect(screen.getByTestId('list-category-type-name')).toHaveTextContent(mockProps.categoryTypeName);
    expect(screen.getByTestId('delete-endpoint')).toHaveTextContent(mockProps.createUpdateDeleteEndpoint);
  });

  it('handles different category types', async () => {
    const expenseProps = {
      ...mockProps,
      categoryTypeName: 'Expense',
    };
    await act(async () => {
      render(<CategoriesPage {...expenseProps} />);
    });
    expect(screen.getByTestId('form-category-type-name')).toHaveTextContent('Expense');
    expect(screen.getByTestId('list-category-type-name')).toHaveTextContent('Expense');
  });

  it('handles income category type', async () => {
    const incomeProps = {
      ...mockProps,
      categoryTypeName: 'Income',
    };
    await act(async () => {
      render(<CategoriesPage {...incomeProps} />);
    });
    expect(screen.getByTestId('form-category-type-name')).toHaveTextContent('Income');
    expect(screen.getByTestId('list-category-type-name')).toHaveTextContent('Income');
  });

  it('handles expense category type', async () => {
    const expenseProps = {
      ...mockProps,
      categoryTypeName: 'Expense',
    };
    await act(async () => {
      render(<CategoriesPage {...expenseProps} />);
    });
    expect(screen.getByTestId('form-category-type-name')).toHaveTextContent('Expense');
    expect(screen.getByTestId('list-category-type-name')).toHaveTextContent('Expense');
  });

  it('handles loading state', async () => {
    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });
  });

  it('handles error state', async () => {
    mockMessageTypeIsError.mockReturnValue(false);

    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    await waitFor(() => {
      expect(screen.getByTestId('is-error')).toHaveTextContent('false');
    });
  });

  it('handles items with data', async () => {
    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      expect(screen.getByTestId('is-error')).toHaveTextContent('false');
    });
  });

  it('calls fetchCategories on mount', async () => {
    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    expect(mockGetRequestList).toHaveBeenCalledWith(mockProps.getEndpoint);
  });

  it('handles different endpoints', async () => {
    const customProps = {
      ...mockProps,
      getEndpoint: '/api/custom-categories',
      createUpdateDeleteEndpoint: '/api/custom-categories',
    };

    await act(async () => {
      render(<CategoriesPage {...customProps} />);
    });
    expect(mockGetRequestList).toHaveBeenCalledWith('/api/custom-categories');
    expect(screen.getByTestId('delete-endpoint')).toHaveTextContent('/api/custom-categories');
  });

  it('tests transformFormDataToCategory with Income category type', async () => {
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

    await act(async () => {
      render(<CategoriesPage {...incomeProps} />);
    });
    
    expect(mockUseForm).toHaveBeenCalledWith({
      itemName: 'Income',
      itemEndpoint: '/api/test-categories',
      transformFormDataToItem: expect.any(Function),
      convertItemToFormData: expect.any(Function),
      fetchItems: expect.any(Function),
    });
  });

  it('tests transformFormDataToCategory with Expense category type', async () => {
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

    await act(async () => {
      render(<CategoriesPage {...expenseProps} />);
    });
    
    expect(mockUseForm).toHaveBeenCalledWith({
      itemName: 'Expense',
      itemEndpoint: '/api/test-categories',
      transformFormDataToItem: expect.any(Function),
      convertItemToFormData: expect.any(Function),
      fetchItems: expect.any(Function),
    });
  });

  it('tests transformFormDataToCategory with other category type', async () => {
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

    await act(async () => {
      render(<CategoriesPage {...otherProps} />);
    });
    
    expect(mockUseForm).toHaveBeenCalledWith({
      itemName: 'Other',
      itemEndpoint: '/api/test-categories',
      transformFormDataToItem: expect.any(Function),
      convertItemToFormData: expect.any(Function),
      fetchItems: expect.any(Function),
    });
  });

  it('tests convertCategoryToFormData function', async () => {
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

    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    
    expect(mockUseForm).toHaveBeenCalledWith({
      itemName: 'Test',
      itemEndpoint: '/api/test-categories',
      transformFormDataToItem: expect.any(Function),
      convertItemToFormData: expect.any(Function),
      fetchItems: expect.any(Function),
    });
  });

  it('tests useEffect dependency on fetchCategories', async () => {
    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    
    expect(mockGetRequestList).toHaveBeenCalledWith(mockProps.getEndpoint);
  });

  it('tests messageTypeIsError function call', async () => {
    mockMessageTypeIsError.mockReturnValue(false);

    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    
    await waitFor(() => {
      expect(mockMessageTypeIsError).toHaveBeenCalledWith({ type: null, text: '' });
      expect(screen.getByTestId('is-error')).toHaveTextContent('false');
    });
  });

  it('tests transformFormDataToCategory function with Income category type', async () => {
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

    await act(async () => {
      render(<CategoriesPage {...incomeProps} />);
    });
    
    const formData = new FormData();
    formData.append('Name', 'Test Income Category');
    
    const result = capturedTransformFunction(formData);
    
    expect(result.item.name).toBe('Test Income Category');
    expect(result.item.categoryType).toBe('Income');
    expect(result.errors).toEqual([]);
  });

  it('tests transformFormDataToCategory function with Expense category type', async () => {
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

    await act(async () => {
      render(<CategoriesPage {...expenseProps} />);
    });
    
    const formData = new FormData();
    formData.append('Name', 'Test Expense Category');
    
    const result = capturedTransformFunction(formData);
    
    expect(result.item.name).toBe('Test Expense Category');
    expect(result.item.categoryType).toBe('Expense');
    expect(result.errors).toEqual([]);
  });

  it('tests transformFormDataToCategory function with other category type', async () => {
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

    await act(async () => {
      render(<CategoriesPage {...otherProps} />);
    });
    
    const formData = new FormData();
    formData.append('Name', 'Test Other Category');
    
    const result = capturedTransformFunction(formData);
    
    expect(result.item.name).toBe('Test Other Category');
    expect(result.item.categoryType).toBeUndefined();
    expect(result.errors).toEqual([]);
  });

  it('tests convertCategoryToFormData function', async () => {
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

    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    
    const mockCategory = { id: 1, name: 'Test Category' };
    const result = capturedConvertFunction(mockCategory);
    
    expect(result).toEqual({ name: 'Test Category' });
  });
}); 