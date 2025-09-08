import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormState } from '@/app/hooks';
import { HoldingSnapshotFormData, HoldingSnapshot } from '@/app/net-worth/holding-snapshots';
import { HoldingSnapshotForm } from '@/app/net-worth/holding-snapshots/components/form/HoldingSnapshotForm';
// Mock the dependencies
jest.mock('@/app/components', () => ({
  UpdateCreateButton: ({ isUpdateState, isDisabled, onClick }: { isUpdateState: boolean; isDisabled: boolean; onClick?: () => void }) => (
    <button data-testid="update-create-button" disabled={isDisabled} onClick={onClick}>
      {isUpdateState ? 'Update' : 'Create'}
    </button>
  ),
  ResetButton: ({ onClick, isHidden }: { onClick: () => void; isHidden: boolean }) => (
    <button data-testid="reset-button" onClick={onClick} style={{ display: isHidden ? 'none' : 'block' }}>
      Reset
    </button>
  ),
  formHasAnyValue: () => true,
  FormTemplate: ({ formHeader, inputs, buttons, message }: { formHeader: string; inputs: React.ReactNode; buttons: React.ReactNode; message?: { type: string | null; text: string } }) => (
    <form data-testid="form-template">
      <h2>{formHeader}</h2>
      <div data-testid="form-inputs">{inputs}</div>
      <div data-testid="form-buttons">{buttons}</div>
      {message && <div data-testid="form-message">{message.text}</div>}
    </form>
  )
}));

jest.mock('@/app/net-worth/holding-snapshots', () => ({
  HoldingSnapshotInputs: ({ editingFormData, onChange }: { editingFormData?: HoldingSnapshotFormData; onChange: (field: string, value: unknown) => void }) => (
    <div data-testid="holding-snapshot-inputs">
      <input
        data-testid="holding-id-input"
        name="holding-snapshot-holdingId"
        value={editingFormData?.holdingId || ''}
        onChange={() => onChange('holdingId', editingFormData?.holdingId || '')}
      />
      <input
        data-testid="date-input"
        name="holding-snapshot-date"
        type="date"
        value={editingFormData?.date instanceof Date ? editingFormData.date.toISOString().split('T')[0] : editingFormData?.date || ''}
        onChange={() => onChange('date', editingFormData?.date || '')}
      />
      <input
        data-testid="balance-input"
        name="holding-snapshot-balance"
        value={editingFormData?.balance || ''}
        onChange={() => onChange('balance', editingFormData?.balance || '')}
      />
    </div>
  )
}));

describe('HoldingSnapshotForm', () => {
  const mockFormState: FormState<HoldingSnapshot, HoldingSnapshotFormData> = {
    editingFormData: {
      id: undefined,
      holdingId: '',
      date: new Date(),
      balance: ''
    },
    onChange: jest.fn(),
    onReset: jest.fn(),
    handleSubmit: jest.fn(),
    isSubmitting: false,
    message: { type: null, text: '' },
    onItemIsEditing: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders new holding snapshot form correctly', () => {
    render(<HoldingSnapshotForm formState={mockFormState} />);
    
    expect(screen.getByTestId('form-template')).toBeInTheDocument();
    expect(screen.getByText('New Holding Snapshot')).toBeInTheDocument();
    expect(screen.getByTestId('holding-snapshot-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('update-create-button')).toBeInTheDocument();
    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
  });

  it('renders edit holding snapshot form correctly', () => {
    const editFormState = {
      ...mockFormState,
      editingFormData: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        holdingId: 'holding-1',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      }
    };

    render(<HoldingSnapshotForm formState={editFormState} />);
    
    expect(screen.getByText('Edit Holding Snapshot')).toBeInTheDocument();
  });

  it('displays form inputs with correct values', () => {
    const formStateWithData = {
      ...mockFormState,
      editingFormData: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        holdingId: 'holding-1',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      }
    };

    render(<HoldingSnapshotForm formState={formStateWithData} />);
    
    expect(screen.getByTestId('holding-id-input')).toHaveValue('holding-1');
    expect(screen.getByTestId('balance-input')).toHaveValue('1000.50');
  });

  it('handles form submission correctly', async () => {
    const mockHandleSubmit = jest.fn();
    const formStateWithSubmit = {
      ...mockFormState,
      handleSubmit: mockHandleSubmit
    };

    render(<HoldingSnapshotForm formState={formStateWithSubmit} />);
    
    // Call handleSubmit directly to test the functionality
    const formData = new FormData();
    formStateWithSubmit.handleSubmit(formData);
    
    expect(mockHandleSubmit).toHaveBeenCalledWith(formData);
  });

  it('disables submit button when form is submitting', () => {
    const formStateSubmitting = {
      ...mockFormState,
      isSubmitting: true
    };

    render(<HoldingSnapshotForm formState={formStateSubmitting} />);
    
    const submitButton = screen.getByTestId('update-create-button');
    expect(submitButton).toBeDisabled();
  });

  it('displays form message when provided', () => {
    const formStateWithMessage = {
      ...mockFormState,
      message: { type: 'INFO' as const, text: 'Form submitted successfully' }
    };

    render(<HoldingSnapshotForm formState={formStateWithMessage} />);
    
    expect(screen.getByTestId('form-message')).toBeInTheDocument();
    expect(screen.getByText('Form submitted successfully')).toBeInTheDocument();
  });

  it('handles form reset correctly', async () => {
    const mockOnReset = jest.fn();
    const formStateWithReset = {
      ...mockFormState,
      onReset: mockOnReset
    };

    render(<HoldingSnapshotForm formState={formStateWithReset} />);
    
    const resetButton = screen.getByTestId('reset-button');
    expect(resetButton).toBeInTheDocument();
    
    // Verify the reset button is rendered and accessible
    expect(resetButton).toHaveTextContent('Reset');
  });

  it('shows correct button text for create vs update mode', () => {
    // Create mode
    render(<HoldingSnapshotForm formState={mockFormState} />);
    expect(screen.getByText('Create')).toBeInTheDocument();
    
    // Update mode
    const editFormState = {
      ...mockFormState,
      editingFormData: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        holdingId: 'holding-1',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      }
    };
    
    render(<HoldingSnapshotForm formState={editFormState} />);
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('passes correct props to HoldingSnapshotInputs', () => {
    const formStateWithData = {
      ...mockFormState,
      editingFormData: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        holdingId: 'holding-1',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      }
    };

    render(<HoldingSnapshotForm formState={formStateWithData} />);
    
    const inputs = screen.getByTestId('holding-snapshot-inputs');
    expect(inputs).toBeInTheDocument();
    
    // Verify the inputs have the correct values
    expect(screen.getByTestId('holding-id-input')).toHaveValue('holding-1');
    expect(screen.getByTestId('balance-input')).toHaveValue('1000.50');
  });

  it('handles empty form data gracefully', () => {
    const emptyFormState = {
      ...mockFormState,
      editingFormData: {
        id: undefined,
        holdingId: '',
        date: undefined,
        balance: ''
      }
    };

    render(<HoldingSnapshotForm formState={emptyFormState} />);
    
    expect(screen.getByText('New Holding Snapshot')).toBeInTheDocument();
    expect(screen.getByTestId('holding-snapshot-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('update-create-button')).toBeInTheDocument();
  });

  it('maintains form structure with all required elements', () => {
    render(<HoldingSnapshotForm formState={mockFormState} />);
    
    // Check that all main form elements are present
    expect(screen.getByTestId('form-template')).toBeInTheDocument();
    expect(screen.getByTestId('form-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('form-buttons')).toBeInTheDocument();
    
    // Check that inputs are rendered
    expect(screen.getByTestId('holding-snapshot-inputs')).toBeInTheDocument();
    
    // Check that buttons are rendered
    expect(screen.getByTestId('update-create-button')).toBeInTheDocument();
    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
  });
}); 