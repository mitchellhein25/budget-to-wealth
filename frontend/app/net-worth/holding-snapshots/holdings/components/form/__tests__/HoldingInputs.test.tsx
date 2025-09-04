import { render, screen, waitFor, act } from '@testing-library/react';
import { getAllHoldingCategories } from '@/app/lib/api';
import { HOLDING_SNAPSHOT_ITEM_NAME_LINK, NET_WORTH_ITEM_NAME_LINK } from '@/app/net-worth/holding-snapshots';
import { HOLDING_CATEGORY_ITEM_NAME_LINK, HOLDING_ITEM_NAME_LOWERCASE, HOLDING_ITEM_NAME_LOWERCASE_PLURAL, HOLDING_TYPE_ASSET, HoldingInputs } from '@/app/net-worth/holding-snapshots/holdings';

const editCategoriesLinkTestId = 'edit-categories-link';

jest.mock('@/app/lib/api', () => ({
  getAllHoldingCategories: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  InputFieldSetTemplate: ({ label, isRequired, inputChild }: { label: string, isRequired: boolean, inputChild: React.ReactNode }) => (
    <div data-testid={`field-${label.toLowerCase()}`}>
      <label>{label}</label>
      <div data-testid={`required-${label.toLowerCase()}`}>{isRequired.toString()}</div>
      {inputChild}
    </div>
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className, title }: { children: React.ReactNode, href: string, className: string, title: string }) => (
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
    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

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
    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

    const idInput = screen.getByTestId('field-name').parentElement?.querySelector('input[hidden]');
    expect(idInput).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-id`);
    expect(idInput).toHaveAttribute('name', `${HOLDING_ITEM_NAME_LOWERCASE}-id`);
    expect(idInput).toHaveAttribute('readonly');
    expect(idInput).toHaveAttribute('hidden');
  });

  it('renders name input with correct attributes and value', async () => {
    const editingFormData = { name: 'Test Holding' };
    await act(async () => {
      render(<HoldingInputs {...defaultProps} editingFormData={editingFormData} />);
    });

    const nameInput = screen.getByDisplayValue('Test Holding');
    expect(nameInput).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-name`);
    expect(nameInput).toHaveAttribute('name', `${HOLDING_ITEM_NAME_LOWERCASE}-name`);
    expect(nameInput).toHaveAttribute('type', 'text');
  });

  it('renders type select with correct options and default value', async () => {
    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

    const typeSelects = screen.getAllByRole('combobox');
    const typeSelect = typeSelects[0]; // First combobox is the type select
    expect(typeSelect).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-type`);
    expect(typeSelect).toHaveAttribute('name', `${HOLDING_ITEM_NAME_LOWERCASE}-type`);

    const options = typeSelect.querySelectorAll('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Asset');
    expect(options[1]).toHaveTextContent('Debt');
  });

  it('renders category select with correct attributes', async () => {
    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

    const categorySelects = screen.getAllByRole('combobox');
    const categorySelect = categorySelects[1]; // Second combobox is the category select
    expect(categorySelect).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-holdingCategoryId`);
    expect(categorySelect).toHaveAttribute('name', `${HOLDING_ITEM_NAME_LOWERCASE}-holdingCategoryId`);
  });

  it('renders institution input with correct attributes', async () => {
    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

    const institutionInput = screen.getByTestId('field-institution').querySelector('input');
    expect(institutionInput).toHaveAttribute('id', `${HOLDING_ITEM_NAME_LOWERCASE}-institution`);
    expect(institutionInput).toHaveAttribute('name', `${HOLDING_ITEM_NAME_LOWERCASE}-institution`);
    expect(institutionInput).toHaveAttribute('type', 'text');
  });

  it('displays provided values in form fields', async () => {
    const editingFormData = {
      name: 'Test Holding',
      type: HOLDING_TYPE_ASSET,
      categoryId: '2',
      institution: 'Test Bank',
    };

    await act(async () => {
      render(<HoldingInputs {...defaultProps} editingFormData={editingFormData} />);
    });

    expect(screen.getByDisplayValue('Test Holding')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Asset')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Bank')).toBeInTheDocument();
  });

  it('displays edit categories link with correct attributes', async () => {
    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

    const editLink = screen.getByTestId(editCategoriesLinkTestId);
    expect(editLink).toHaveAttribute('href', `/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_SNAPSHOT_ITEM_NAME_LINK}/${HOLDING_ITEM_NAME_LOWERCASE_PLURAL}/${HOLDING_CATEGORY_ITEM_NAME_LINK}`);
    expect(editLink).toHaveAttribute('title', 'Edit Holding Categories');
  });

  it('displays edit icon', async () => {
    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('calls setIsLoading when component mounts', async () => {
    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('handles empty editingFormData', async () => {
    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

    const nameInput = screen.getByTestId('field-name').querySelector('input');
    expect(nameInput).toHaveDisplayValue('');
    expect(screen.getByDisplayValue('Asset')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    mockGetAllHoldingCategories.mockResolvedValue({
      successful: false,
      data: [],
      responseMessage: 'Error fetching categories',
    });

    await act(async () => {
      render(<HoldingInputs {...defaultProps} />);
    });

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });
}); 