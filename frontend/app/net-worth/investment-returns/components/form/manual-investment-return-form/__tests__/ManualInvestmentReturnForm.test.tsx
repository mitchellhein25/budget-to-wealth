import { render, screen, waitFor } from '@testing-library/react';
import { FormState } from '@/app/hooks';
import { MANUAL_INVESTMENT_RETURN_ITEM_NAME, MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, ManualInvestmentReturnFormData, ManualInvestmentReturn,  } from '@/app/net-worth/investment-returns';
import { ManualInvestmentReturnForm } from '@/app/net-worth/investment-returns/components/form/manual-investment-return-form/ManualInvestmentReturnForm';

const formTemplateTestId = 'form-template';
const manualInvestmentInputsTestId = 'manual-investment-inputs';
const formTemplateText = 'Form Template';
const manualInvestmentInputsText = 'Manual Investment Inputs';
const updateCreateButtonText = 'Update/Create Button';
const resetButtonText = 'Reset Button';

jest.mock('@/app/components', () => ({
  formHasAnyValue: () => true,
  FormTemplate: ({ formId, formHeader, inputs, buttons, message }: { formId: string, formHeader: string, inputs: React.ReactNode, buttons: React.ReactNode, message: { type: string | null, text: string } }) => (
    <div data-testid={formTemplateTestId}>
      <div>{formTemplateText}</div>
      <div data-testid="form-id">{formId}</div>
      <div data-testid="form-header">{formHeader}</div>
      {inputs}
      {buttons}
      {message && <div data-testid="message">{JSON.stringify(message)}</div>}
    </div>
  ),
  UpdateCreateButton: ({ isUpdateState, isDisabled }: { isUpdateState: boolean, isDisabled: boolean }) => (
    <div data-testid="update-create-button" data-is-update={isUpdateState} data-is-disabled={isDisabled}>
      {updateCreateButtonText}
    </div>
  ),
  ResetButton: ({ onClick, isHidden }: { onClick: () => void, isHidden: boolean }) => (
    <div data-testid="reset-button" data-is-hidden={isHidden} onClick={onClick}>
      {resetButtonText}
    </div>
  ),
}));

jest.mock('@/app/net-worth/investment-returns', () => ({
  ManualInvestmentInputs: ({ editingFormData, manualCategories }: {
    editingFormData: unknown;
    manualCategories: unknown[];
  }) => (
    <div data-testid={manualInvestmentInputsTestId}>
      {manualInvestmentInputsText}
      <div data-testid="editing-form-data">{JSON.stringify(editingFormData)}</div>
      <div data-testid="manual-categories-count">{manualCategories?.length || 0}</div>
    </div>
  ),
}));

jest.mock('@/app/lib/api', () => ({
  getManualInvestmentCategories: jest.fn(),
}));

const mockGetManualInvestmentCategories = jest.requireMock('@/app/lib/api').getManualInvestmentCategories;

describe('ManualInvestmentReturnForm', () => {
  const mockFormState: FormState<ManualInvestmentReturn, ManualInvestmentReturnFormData> = {
    editingFormData: {
      manualInvestmentCategoryId: '',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-15'),
      manualInvestmentPercentageReturn: '',
    },
    onChange: jest.fn() as jest.MockedFunction<() => void>,
    handleSubmit: jest.fn(),
    onReset: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: { type: null, text: '' },
  };

  const mockManualCategories = [
    { id: '1', name: 'Stocks' },
    { id: '2', name: 'Bonds' },
    { id: '3', name: 'Real Estate' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockGetManualInvestmentCategories.mockResolvedValue({
      successful: true,
      data: mockManualCategories
    });
  });

  it('renders with correct form ID', async () => {
    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('form-id')).toHaveTextContent(`${MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-form`);
    });
  });

  it('composes all required components', async () => {
    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      expect(screen.getByTestId(formTemplateTestId)).toBeInTheDocument();
      expect(screen.getByTestId(manualInvestmentInputsTestId)).toBeInTheDocument();
      expect(screen.getByTestId('update-create-button')).toBeInTheDocument();
      expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    });
  });

  it('renders with New header when editingFormData.id is not present', async () => {
    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('form-header')).toHaveTextContent(`New ${MANUAL_INVESTMENT_RETURN_ITEM_NAME}`);
    });
  });

  it('renders with Edit header when editingFormData.id is present', async () => {
    const editFormState = {
      ...mockFormState,
      editingFormData: { 
        ...mockFormState.editingFormData,
        id: 'some-id' 
      },
    };
    
    render(<ManualInvestmentReturnForm formState={editFormState} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('form-header')).toHaveTextContent(`Edit ${MANUAL_INVESTMENT_RETURN_ITEM_NAME}`);
    });
  });

  it('fetches manual categories on mount', async () => {
    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      expect(mockGetManualInvestmentCategories).toHaveBeenCalledTimes(1);
    });
  });

  it('shows manual categories count in inputs', async () => {
    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('manual-categories-count')).toHaveTextContent('3');
    });
  });

  it('handles empty manual categories array gracefully', async () => {
    mockGetManualInvestmentCategories.mockResolvedValue({
      successful: true,
      data: []
    });

    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('manual-categories-count')).toHaveTextContent('0');
    });
  });

  it('handles API error when fetching categories', async () => {
    mockGetManualInvestmentCategories.mockResolvedValue({
      successful: false,
      data: null
    });

    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('manual-categories-count')).toHaveTextContent('0');
    });
  });

  it('disables update/create button when loading', async () => {
    // Mock a delayed response to simulate loading state
    mockGetManualInvestmentCategories.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({ successful: true, data: mockManualCategories }), 100)
    ));

    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    // Button should be disabled initially during loading
    expect(screen.getByTestId('update-create-button')).toHaveAttribute('data-is-disabled', 'true');
  });

  it('disables update/create button when submitting', async () => {
    const submittingFormState = {
      ...mockFormState,
      isSubmitting: true
    };

    render(<ManualInvestmentReturnForm formState={submittingFormState} />);
    
    await waitFor(() => {
      const updateButton = screen.getByTestId('update-create-button');
      expect(updateButton).toHaveAttribute('data-is-disabled', 'true');
    });
  });

  it('shows update button when editing existing item', async () => {
    const editFormState = {
      ...mockFormState,
      editingFormData: { 
        ...mockFormState.editingFormData,
        id: 'some-id' 
      },
    };
    
    render(<ManualInvestmentReturnForm formState={editFormState} />);
    
    await waitFor(() => {
      const updateButton = screen.getByTestId('update-create-button');
      expect(updateButton).toHaveAttribute('data-is-update', 'true');
    });
  });

  it('shows create button when creating new item', async () => {
    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      const updateButton = screen.getByTestId('update-create-button');
      expect(updateButton).toHaveAttribute('data-is-update', 'false');
    });
  });

  it('passes correct props to ManualInvestmentInputs', async () => {
    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('editing-form-data')).toBeInTheDocument();
      expect(screen.getByTestId('manual-categories-count')).toHaveTextContent('3');
    });
  });

  it('displays form message when present', async () => {
    const formStateWithMessage = {
      ...mockFormState,
      message: { type: 'ERROR' as const, text: 'Test error message' }
    };

    render(<ManualInvestmentReturnForm formState={formStateWithMessage} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent(JSON.stringify(formStateWithMessage.message));
    });
  });

  it('enables update/create button after loading completes', async () => {
    render(<ManualInvestmentReturnForm formState={mockFormState} />);
    
    await waitFor(() => {
      const updateButton = screen.getByTestId('update-create-button');
      expect(updateButton).toHaveAttribute('data-is-disabled', 'false');
    });
  });
});
