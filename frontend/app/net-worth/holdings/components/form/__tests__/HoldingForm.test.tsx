import { render, screen } from '@testing-library/react';
import { HoldingForm } from '../HoldingForm';
import { FormState } from '@/app/hooks';
import { HOLDING_ITEM_NAME_LOWERCASE, Holding, HoldingFormData } from '../..';

const formTemplateTestId = 'form-template';
const holdingInputsTestId = 'holding-inputs';
const formTemplateText = 'Form Template';
const holdingInputsText = 'Holding Inputs';
const updateCreateButtonText = 'Update/Create Button';
const resetButtonText = 'Reset Button';

jest.mock('@/app/components/form', () => ({
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
}));

jest.mock('@/app/components/buttons', () => ({
  UpdateCreateButton: () => <div>{updateCreateButtonText}</div>,
  ResetButton: () => <div>{resetButtonText}</div>,
}));

jest.mock('../HoldingInputs', () => ({
  HoldingInputs: () => (
    <div data-testid={holdingInputsTestId}>
      {holdingInputsText}
    </div>
  ),
}));

describe('HoldingForm', () => {
  const mockFormState: FormState<Holding, HoldingFormData> = {
    editingFormData: {},
    onChange: jest.fn(),
    handleSubmit: jest.fn(),
    onReset: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: { type: null, text: '' },
  };

  it('renders with correct form ID', () => {
    render(<HoldingForm formState={mockFormState} />);
    
    expect(screen.getByTestId('form-id')).toHaveTextContent(`${HOLDING_ITEM_NAME_LOWERCASE}-form`);
  });

  it('composes all required components', () => {
    render(<HoldingForm formState={mockFormState} />);
    
    expect(screen.getByTestId(formTemplateTestId)).toBeInTheDocument();
    expect(screen.getByTestId(holdingInputsTestId)).toBeInTheDocument();
    expect(screen.getByText(updateCreateButtonText)).toBeInTheDocument();
    expect(screen.getByText(resetButtonText)).toBeInTheDocument();
  });

  it('renders with Edit header when editingFormData.id is present', () => {
    const editFormState = {
      ...mockFormState,
      editingFormData: { id: 'some-id' },
    };
    render(<HoldingForm formState={editFormState} />);
    expect(screen.getByTestId('form-header')).toHaveTextContent('Edit Holding');
  });
}); 