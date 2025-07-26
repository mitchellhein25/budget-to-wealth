import { render, screen } from '@testing-library/react';
import { FormState } from '@/app/hooks';
import { BUDGET_ITEM_NAME_LOWERCASE, BudgetsForm } from '../';

const formTemplateTestId = 'form-template';
const budgetInputsTestId = 'budget-inputs';
const updateCreateButtonText = 'Update/Create Button';
const resetButtonText = 'Reset Button';
const formIdTestId = 'form-id';
const formHeaderTestId = 'form-header';
const messageTestId = 'message';


jest.mock('@/app/components/form', () => ({
  FormTemplate: ({ formId, formHeader, inputs, buttons, message }: any) => (
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

jest.mock('./BudgetInputs', () => ({
  BudgetInputs: ({ editingFormData, onChange, setIsLoading }: any) => (
    <div data-testid={budgetInputsTestId}>
      {budgetInputsTestId}
    </div>
  ),
}));

describe('BudgetsForm', () => {
  const mockFormState: FormState<any, any> = {
    editingFormData: {},
    onChange: jest.fn(),
    handleSubmit: jest.fn(),
    onReset: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: { type: null, text: '' },
  };

  it('renders with correct form ID', () => {
    render(<BudgetsForm formState={mockFormState} />);
    
    expect(screen.getByTestId(formIdTestId)).toHaveTextContent(`${BUDGET_ITEM_NAME_LOWERCASE}-form`);
  });

  it('composes all required components', () => {
    render(<BudgetsForm formState={mockFormState} />);
    
    expect(screen.getByTestId(formTemplateTestId)).toBeInTheDocument();
    expect(screen.getByTestId(budgetInputsTestId)).toBeInTheDocument();
    expect(screen.getByText(updateCreateButtonText)).toBeInTheDocument();
    expect(screen.getByText(resetButtonText)).toBeInTheDocument();
  });
}); 