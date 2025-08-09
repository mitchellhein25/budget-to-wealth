import { render, screen } from '@testing-library/react';
import { FormState } from '@/app/hooks';
import { CashFlowEntriesForm } from './CashFlowEntriesForm';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME, INCOME_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME_LOWERCASE } from '..';

const formTemplateTestId = 'form-template';
const cashFlowEntriesInputsTestId = 'cash-flow-entries-inputs';
const updateCreateButtonText = 'Update/Create Button';
const resetButtonText = 'Reset Button';
const formIdTestId = 'form-id';
const formHeaderTestId = 'form-header';
const messageTestId = 'message';

interface FormTemplateProps {
  formId: string;
  formHeader: string;
  inputs: React.ReactNode;
  buttons: React.ReactNode;
  message?: { type: string | null; text: string };
}

interface CashFlowEntriesInputsProps {
  editingFormData: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  setIsLoading: (loading: boolean) => void;
}

jest.mock('@/app/components/form', () => ({
  formHasAnyValue: () => true,
  FormTemplate: ({ formId, formHeader, inputs, buttons, message }: FormTemplateProps) => (
    <div data-testid={formTemplateTestId}>
      <div>{formTemplateTestId}</div>
      <div data-testid={formIdTestId}>{formId}</div>
      <div data-testid={formHeaderTestId}>{formHeader}</div>
      {inputs}
      {buttons}
      {message && <div data-testid={messageTestId}>{JSON.stringify(message)}</div>}
    </div>
  ),
}));

jest.mock('@/app/components/buttons', () => ({
  UpdateCreateButton: () => <div>{updateCreateButtonText}</div>,
  ResetButton: () => <div>{resetButtonText}</div>,
}));

jest.mock('./CashFlowEntriesInputs', () => ({
  CashFlowEntriesInputs: ({ }: CashFlowEntriesInputsProps) => (
    <div data-testid={cashFlowEntriesInputsTestId}>
      {cashFlowEntriesInputsTestId}
    </div>
  ),
}));

describe('CashFlowEntriesForm', () => {
  const mockFormState: FormState<Record<string, unknown>, Record<string, unknown>> = {
    editingFormData: {},
    onChange: jest.fn(),
    handleSubmit: jest.fn(),
    onReset: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: { type: null, text: '' },
  };

  it('renders with correct form ID for income', () => {
    render(<CashFlowEntriesForm formState={mockFormState} cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByTestId(formIdTestId)).toHaveTextContent(`${INCOME_ITEM_NAME_LOWERCASE}-form`);
  });

  it('renders with correct form ID for expense', () => {
    render(<CashFlowEntriesForm formState={mockFormState} cashFlowType={EXPENSE_ITEM_NAME} />);
    
    expect(screen.getByTestId(formIdTestId)).toHaveTextContent(`${EXPENSE_ITEM_NAME_LOWERCASE}-form`);
  });

  it('displays correct form header for new entry', () => {
    render(<CashFlowEntriesForm formState={mockFormState} cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByTestId(formHeaderTestId)).toHaveTextContent(`New ${INCOME_ITEM_NAME} Entry`);
  });

  it('displays correct form header for editing entry', () => {
    const editingFormState = {
      ...mockFormState,
      editingFormData: { id: '123e4567-e89b-12d3-a456-426614174000' },
    };

    render(<CashFlowEntriesForm formState={editingFormState} cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByTestId(formHeaderTestId)).toHaveTextContent(`Edit ${INCOME_ITEM_NAME} Entry`);
  });

  it('composes all required components', () => {
    render(<CashFlowEntriesForm formState={mockFormState} cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByTestId(formTemplateTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesInputsTestId)).toBeInTheDocument();
    expect(screen.getByText(updateCreateButtonText)).toBeInTheDocument();
    expect(screen.getByText(resetButtonText)).toBeInTheDocument();
  });
}); 