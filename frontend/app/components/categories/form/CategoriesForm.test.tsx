import { render, screen } from '@testing-library/react';
import { FormState } from '@/app/hooks';
import { CategoriesForm } from './CategoriesForm';

const formTemplateTestId = 'form-template';
const categoriesInputsTestId = 'categories-inputs';
const updateCreateButtonText = 'Update/Create Button';
const resetButtonText = 'Reset Button';
const formIdTestId = 'form-id';
const formHeaderTestId = 'form-header';
const messageTestId = 'message';

jest.mock('@/app/components/form', () => ({
  __esModule: true,
  formHasAnyValue: () => true,
  FormTemplate: ({ formId, formHeader, inputs, buttons, message }: { 
    formId: string; 
    formHeader: string; 
    inputs: React.ReactNode; 
    buttons: React.ReactNode; 
    message?: React.ReactNode; 
  }) => (
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

jest.mock('@/app/components/buttons/UpdateCreateButton', () => ({
  __esModule: true,
  UpdateCreateButton: () => <div>{updateCreateButtonText}</div>,
}));

jest.mock('@/app/components/buttons/ResetButton', () => ({
  __esModule: true,
  ResetButton: () => <div>{resetButtonText}</div>,
}));

jest.mock('./CategoriesInputs', () => ({
  __esModule: true,
  CategoriesInputs: ({}: { editingFormData: unknown; onChange: () => void }) => (
    <div data-testid={categoriesInputsTestId}>
      {categoriesInputsTestId}
    </div>
  ),
}));

describe('CategoriesForm', () => {
  const mockFormState: FormState<unknown, unknown> = {
    editingFormData: {},
    onChange: jest.fn(),
    handleSubmit: jest.fn(),
    onReset: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: { type: null, text: '' },
  };

  const categoryTypeName = 'Test';

  it('renders with correct form ID', () => {
    render(<CategoriesForm formState={mockFormState} categoryTypeName={categoryTypeName} />);
    expect(screen.getByTestId(formIdTestId)).toHaveTextContent(`${categoryTypeName.toLowerCase()}-category-form`);
  });

  it('composes all required components', () => {
    render(<CategoriesForm formState={mockFormState} categoryTypeName={categoryTypeName} />);
    expect(screen.getByTestId(formTemplateTestId)).toBeInTheDocument();
    expect(screen.getByTestId(categoriesInputsTestId)).toBeInTheDocument();
    expect(screen.getByText(updateCreateButtonText)).toBeInTheDocument();
    expect(screen.getByText(resetButtonText)).toBeInTheDocument();
  });

  it('shows correct header for new category', () => {
    render(<CategoriesForm formState={mockFormState} categoryTypeName={categoryTypeName} />);
    expect(screen.getByTestId(formHeaderTestId)).toHaveTextContent(`New ${categoryTypeName} Category`);
  });

  it('shows correct header for editing category', () => {
    const editingFormState = {
      ...mockFormState,
      editingFormData: { id: '1', name: 'Test Category' },
    };
    render(<CategoriesForm formState={editingFormState} categoryTypeName={categoryTypeName} />);
    expect(screen.getByTestId(formHeaderTestId)).toHaveTextContent(`Edit ${categoryTypeName} Category`);
  });
}); 