import { render, screen, waitFor, act } from '@testing-library/react';
import { useForm } from '@/app/hooks';
import { getRequestList } from '@/app/lib/api';
import { messageTypeIsError } from '@/app/lib/utils';
import { Category, CategoryFormData, CategoriesPage } from '@/app/components';
import { CashFlowCategory } from '@/app/cashflow/components';

const categoriesFormTestId = 'categories-form';
const categoriesListTestId = 'categories-list';
const categoriesFormText = 'Categories Form';
const categoriesListText = 'Categories List';

jest.mock('@/app/hooks', () => ({
  useForm: jest.fn(),
  useMobileDetection: jest.fn(),
}));

jest.mock('@/app/lib/api/rest-methods', () => ({
  getRequestList: jest.fn(),
}));

jest.mock('@/app/components/categories/form/CategoriesForm', () => ({
  __esModule: true,
  CategoriesForm: ({ categoryTypeName }: { formState: unknown; categoryTypeName: string }) => (
    <div data-testid={categoriesFormTestId}>
      <div>{categoriesFormText}</div>
      <div data-testid="form-category-type-name">{categoryTypeName}</div>
    </div>
  ),
}));

jest.mock('@/app/components/categories/list/CategoriesList', () => ({
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

jest.mock('@/app/components/Utils', () => ({
  messageTypeIsError: jest.fn(),
  replaceSpacesWithDashes: jest.fn(),
}));

describe('CategoriesPage', () => {
  const mockUseForm = jest.mocked(useForm<Category, CategoryFormData>);
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
      editingFormData: {} as Partial<CategoryFormData>,
      onChange: jest.fn(),
      handleSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      onReset: jest.fn(),
      isSubmitting: false,
      message: { type: null, text: '' },
    });
    
    mockGetRequestList.mockResolvedValue({
      successful: true,
      responseMessage: '',
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
  
    mockUseForm.mockReturnValue({
      editingFormData: {} as Partial<CategoryFormData>,
      onChange: jest.fn(),
      handleSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      onReset: jest.fn(),
      isSubmitting: false,
      message: { type: null, text: '' },
    } as unknown as ReturnType<typeof useForm<Category, CategoryFormData>>);

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

    mockUseForm.mockReturnValue({
      editingFormData: {} as Partial<CategoryFormData>,
      onChange: jest.fn(),
      handleSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      onReset: jest.fn(),
      isSubmitting: false,
      message: { type: null, text: '' },
    } as unknown as ReturnType<typeof useForm<Category, CategoryFormData>>);

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

    mockUseForm.mockReturnValue({
      editingFormData: {} as Partial<CategoryFormData>,
      onChange: jest.fn(),
      handleSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      onReset: jest.fn(),
      isSubmitting: false,
      message: { type: null, text: '' },
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
    mockUseForm.mockReturnValue({
      editingFormData: {} as Partial<CategoryFormData>,
      onChange: jest.fn(),
      handleSubmit: jest.fn(),
      onItemIsEditing: jest.fn(),
      onReset: jest.fn(),
      isSubmitting: false,
      message: { type: null, text: '' },
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

    let capturedTransformFunction: (formData: FormData) => unknown = () => ({});
    mockUseForm.mockImplementation((config: import('@/app/hooks/useForm').useFormArgs<Category, CategoryFormData>) => {
      capturedTransformFunction = config.transformFormDataToItem;
      return {
        editingFormData: {} as Partial<CategoryFormData>,
        onChange: jest.fn(),
        handleSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        onReset: jest.fn(),
        isSubmitting: false,
        message: { type: null, text: '' },
      } as unknown as ReturnType<typeof useForm<Category, CategoryFormData>>;
    });

    await act(async () => {
      render(<CategoriesPage {...incomeProps} />);
    });
    
    const formData = new FormData();
    formData.append('income-name', 'Test Income Category');
    
    const result = capturedTransformFunction(formData) as { item: CashFlowCategory; errors: string[] };
    
    expect(result.item.name).toBe('Test Income Category');
    expect(result.item.categoryType).toBe('Income');
    expect(result.errors).toEqual([]);
  });

  it('tests transformFormDataToCategory function with Expense category type', async () => {
    const expenseProps = {
      ...mockProps,
      categoryTypeName: 'Expense',
    };

    let capturedTransformFunction: (formData: FormData) => unknown = () => ({});
    mockUseForm.mockImplementation((config: import('@/app/hooks/useForm').useFormArgs<Category, CategoryFormData>) => {
      capturedTransformFunction = config.transformFormDataToItem;
      return {
        editingFormData: {} as Partial<CategoryFormData>,
        onChange: jest.fn(),
        handleSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        onReset: jest.fn(),
        isSubmitting: false,
        message: { type: null, text: '' },
      } as unknown as ReturnType<typeof useForm<Category, CategoryFormData>>;
    });

    await act(async () => {
      render(<CategoriesPage {...expenseProps} />);
    });
    
    const formData = new FormData();
    formData.append('expense-name', 'Test Expense Category');
    
    const result = capturedTransformFunction(formData) as { item: CashFlowCategory; errors: string[] };
    
    expect(result.item.name).toBe('Test Expense Category');
    expect(result.item.categoryType).toBe('Expense');
    expect(result.errors).toEqual([]);
  });

  it('tests transformFormDataToCategory function with other category type', async () => {
    const otherProps = {
      ...mockProps,
      categoryTypeName: 'Other',
    };

    let capturedTransformFunction: (formData: FormData) => unknown = () => ({});
    mockUseForm.mockImplementation((config: import('@/app/hooks/useForm').useFormArgs<Category, CategoryFormData>) => {
      capturedTransformFunction = config.transformFormDataToItem;
      return {
        editingFormData: {} as Partial<CategoryFormData>,
        onChange: jest.fn(),
        handleSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        onReset: jest.fn(),
        isSubmitting: false,
        message: { type: null, text: '' },
      } as unknown as ReturnType<typeof useForm<Category, CategoryFormData>>;
    });

    await act(async () => {
      render(<CategoriesPage {...otherProps} />);
    });
    
    const formData = new FormData();
    formData.append('other-name', 'Test Other Category');
    
    const result = capturedTransformFunction(formData) as { item: CashFlowCategory; errors: string[] };
    
    expect(result.item.name).toBe('Test Other Category');
    expect(result.item.categoryType).toBeUndefined();
    expect(result.errors).toEqual([]);
  });

  it('tests convertCategoryToFormData function', async () => {
    let capturedConvertFunction: (item: CashFlowCategory) => CategoryFormData = () => ({ name: '' });
    mockUseForm.mockImplementation((config: { convertItemToFormData: (item: CashFlowCategory) => CategoryFormData }) => {
      capturedConvertFunction = config.convertItemToFormData;
      return {
        editingFormData: {} as Partial<CategoryFormData>,
        onChange: jest.fn(),
        handleSubmit: jest.fn(),
        onItemIsEditing: jest.fn(),
        onReset: jest.fn(),
        isSubmitting: false,
        message: { type: null, text: '' },
      } as unknown as ReturnType<typeof useForm<Category, CategoryFormData>>;
    });

    await act(async () => {
      render(<CategoriesPage {...mockProps} />);
    });
    
    const mockCategory = { id: 1, name: 'Test Category' } as CashFlowCategory;
    const result = capturedConvertFunction(mockCategory);
    
    expect(result).toEqual({ id: '1', name: 'Test Category' });
  });
}); 