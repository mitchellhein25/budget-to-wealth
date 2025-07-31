import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HoldingInputs } from '../HoldingInputs';
import { getAllHoldingCategories } from '@/app/lib/api/data-methods';
import { HOLDING_ITEM_NAME_LOWERCASE, HOLDING_TYPE_ASSET, HOLDING_TYPE_DEBT } from '../../constants';

const nameInputTestId = 'name-input';
const typeSelectTestId = 'type-select';
const categorySelectTestId = 'category-select';
const institutionInputTestId = 'institution-input';
const idInputTestId = 'id-input';
const editCategoriesLinkTestId = 'edit-categories-link';

jest.mock('@/app/lib/api/data-methods', () => ({
  getAllHoldingCategories: jest.fn(),
}));

jest.mock('@/app/components/form', () => ({
  InputFieldSetTemplate: ({ label, isRequired, inputChild }: any) => (
    <div data-testid={`field-${label.toLowerCase()}`}>
      <label>{label}</label>
      <div data-testid={`required-${label.toLowerCase()}`}>{isRequired.toString()}</div>
      {inputChild}
    </div>
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className, title }: any) => (
    <a data-testid={editCategoriesLinkTestId} href={href} className={className} title={title}>
      {children}
    </a>
  ),
}));

jest.mock('lucide-react', () => ({
  Edit: () => <span data-testid="edit-icon">Edit</span>,
}));

describe('HoldingInputs', () => {
  const mockGetAllHoldingCategories = jest.mocked(getAllHoldingCategories);
  const mockOnChange = jest.fn();
  const mockSetIsLoading = jest.fn();

  const mockCategories = [
    { id: 1, name: 'Stocks' },
    { id: 2, name: 'Bonds' },
    { id: 3, name: 'Real Estate' },
  ];

  const defaultProps = {
    editingFormData: {},
    onChange: mockOnChange,
    setIsLoading: mockSetIsLoading,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllHoldingCategories.mockResolvedValue({
      successful: true,
      data: mockCategories,
      responseMessage: 'Success',
    });
  });

  it('renders all form fields with correct labels and requirements', async () => {
    render(<HoldingInputs {...defaultProps} />);

    expect(screen.getByTestId('field-name')).toBeInTheDocument();
    expect(screen.getByTestId('field-type')).toBeInTheDocument();
    expect(screen.getByTestId('field-category')).toBeInTheDocument();
    expect(screen.getByTestId('field-institution')).toBeInTheDocument();

    expect(screen.getByTestId('required-name')).toHaveTextContent('true');
    expect(screen.getByTestId('required-type')).toHaveTextContent('true');
    expect(screen.getByTestId('required-category')).toHaveTextContent('true');
    expect(screen.getByTestId('required-institution')).toHaveTextContent('false');
  });

  it('renders hidden id input with correct attributes', async () => {
    render(<HoldingInputs {...defaultProps} />);

    const idInput = screen.getByTestId('field-name').parentElement?.querySelector('input[hidden]');
    expect(idInput).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-id`);
    expect(idInput).toHaveAttribute('name', `${HOLDING_ITEM_NAME_LOWERCASE}-id`);
    expect(idInput).toHaveAttribute('readonly');
    expect(idInput).toHaveAttribute('hidden');
  });

  it('renders name input with correct attributes and value', async () => {
    const editingFormData = { name: 'Test Holding' };
    render(<HoldingInputs {...defaultProps} editingFormData={editingFormData} />);

    const nameInput = screen.getByDisplayValue('Test Holding');
    expect(nameInput).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-name`);
    expect(nameInput).toHaveAttribute('name', `${HOLDING_ITEM_NAME_LOWERCASE}-name`);
    expect(nameInput).toHaveAttribute('type', 'text');
  });

  it('renders type select with correct options and default value', async () => {
    render(<HoldingInputs {...defaultProps} />);

    const typeSelect = screen.getByDisplayValue(HOLDING_TYPE_ASSET);
    expect(typeSelect).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-type`);
    expect(typeSelect).toHaveAttribute('name', `${HOLDING_ITEM_NAME_LOWERCASE}-type`);

    expect(screen.getByText(HOLDING_TYPE_ASSET)).toBeInTheDocument();
    expect(screen.getByText(HOLDING_TYPE_DEBT)).toBeInTheDocument();
  });

  it('renders type select with editing form data value', async () => {
    const editingFormData = { type: HOLDING_TYPE_DEBT };
    render(<HoldingInputs {...defaultProps} editingFormData={editingFormData} />);

    expect(screen.getByDisplayValue(HOLDING_TYPE_DEBT)).toBeInTheDocument();
  });

  it('renders category select with placeholder and edit link', async () => {
    render(<HoldingInputs {...defaultProps} />);

    const categorySelect = screen.getByTestId('field-category').querySelector('select');
    expect(categorySelect).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-holdingCategoryId`);
    expect(screen.getByText('Pick a category')).toBeInTheDocument();

    const editLink = screen.getByTestId(editCategoriesLinkTestId);
    expect(editLink).toHaveAttribute('href', '/net-worth/holdings/holding-categories');
    expect(editLink).toHaveAttribute('title', 'Edit Holding Categories');
  });

  it('renders institution input with correct attributes', async () => {
    const editingFormData = { institution: 'Test Bank' };
    render(<HoldingInputs {...defaultProps} editingFormData={editingFormData} />);

    const institutionInput = screen.getByDisplayValue('Test Bank');
    expect(institutionInput).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-institution`);
    expect(institutionInput).toHaveAttribute('name', `${HOLDING_ITEM_NAME_LOWERCASE}-institution`);
    expect(institutionInput).toHaveAttribute('type', 'text');
  });

  it('fetches categories on mount and sets loading state', async () => {
    render(<HoldingInputs {...defaultProps} />);

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockGetAllHoldingCategories).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });

  it('populates category select with fetched categories sorted by name', async () => {
    render(<HoldingInputs {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Bonds')).toBeInTheDocument();
      expect(screen.getByText('Real Estate')).toBeInTheDocument();
      expect(screen.getByText('Stocks')).toBeInTheDocument();
    });
  });

  it('handles category fetch failure gracefully', async () => {
    mockGetAllHoldingCategories.mockResolvedValue({
      successful: false,
      data: null,
      responseMessage: 'Failed to fetch categories',
    });

    render(<HoldingInputs {...defaultProps} />);

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    expect(screen.getByText('Pick a category')).toBeInTheDocument();
  });

  it('calls onChange when name input changes', async () => {
    render(<HoldingInputs {...defaultProps} />);

    const nameInput = screen.getByTestId('field-name').querySelector('input');
    fireEvent.change(nameInput!, { target: { value: 'New Holding' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange when type select changes', async () => {
    render(<HoldingInputs {...defaultProps} />);

    const typeSelect = screen.getByTestId('field-type').querySelector('select');
    fireEvent.change(typeSelect!, { target: { value: HOLDING_TYPE_DEBT } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange when category select changes', async () => {
    render(<HoldingInputs {...defaultProps} />);

    await waitFor(() => {
      const categorySelect = screen.getByTestId('field-category').querySelector('select');
      fireEvent.change(categorySelect!, { target: { value: '1' } });
    });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange when institution input changes', async () => {
    render(<HoldingInputs {...defaultProps} />);

    const institutionInput = screen.getByTestId('field-institution').querySelector('input');
    fireEvent.change(institutionInput!, { target: { value: 'New Bank' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays selected category when editingFormData has holdingCategoryId', async () => {
    const editingFormData = { holdingCategoryId: '2' };
    render(<HoldingInputs {...defaultProps} editingFormData={editingFormData} />);

    await waitFor(() => {
      const categorySelect = screen.getByTestId('field-category').querySelector('select');
      expect(categorySelect).toHaveValue('2');
    });
  });

  it('handles empty editingFormData gracefully', async () => {
    render(<HoldingInputs {...defaultProps} editingFormData={{}} />);

    const nameInput = screen.getByTestId('field-name').querySelector('input');
    const typeSelect = screen.getByTestId('field-type').querySelector('select');
    const institutionInput = screen.getByTestId('field-institution').querySelector('input');

    expect(nameInput).toHaveValue('');
    expect(typeSelect).toHaveValue(HOLDING_TYPE_ASSET);
    expect(institutionInput).toHaveValue('');
  });

  it('handles partial editingFormData gracefully', async () => {
    const editingFormData = { name: 'Partial Data' };
    render(<HoldingInputs {...defaultProps} editingFormData={editingFormData} />);

    const nameInput = screen.getByTestId('field-name').querySelector('input');
    const typeSelect = screen.getByTestId('field-type').querySelector('select');
    const institutionInput = screen.getByTestId('field-institution').querySelector('input');

    expect(nameInput).toHaveValue('Partial Data');
    expect(typeSelect).toHaveValue(HOLDING_TYPE_ASSET);
    expect(institutionInput).toHaveValue('');
  });
}); 