import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormState } from '@/app/hooks';
import { HoldingSnapshotFormData, HoldingSnapshot, HOLDING_SNAPSHOT_ITEM_NAME } from '@/app/net-worth/holding-snapshots';
import { HoldingSnapshotForm } from '@/app/net-worth/holding-snapshots/components/form/HoldingSnapshotForm';

jest.mock('@/app/components', () => ({
  UpdateCreateButton: jest.fn(({ isUpdateState, isDisabled }: { isUpdateState: boolean; isDisabled: boolean }) => (
    <button data-testid="update-create-button" disabled={isDisabled}>
      {isUpdateState ? 'Update' : 'Create'}
    </button>
  )),
  ResetButton: jest.fn(({ onClick, isHidden }: { onClick: () => void; isHidden: boolean }) => (
    <button data-testid="reset-button" onClick={onClick} style={{ display: isHidden ? 'none' : 'block' }}>
      Reset
    </button>
  )),
  formHasAnyValue: jest.fn(() => true),
  FormTemplate: jest.fn(({ formHeader, inputs, buttons, message }: { 
    formId: string;
    handleSubmit: (formData: FormData) => void;
    formHeader: string; 
    inputs: React.ReactNode; 
    buttons: React.ReactNode; 
    message?: { type: string | null; text: string } 
  }) => (
    <form data-testid="form-template">
      <h2>{formHeader}</h2>
      <div data-testid="form-inputs">{inputs}</div>
      <div data-testid="form-buttons">{buttons}</div>
      {message && <div data-testid="form-message">{message.text}</div>}
    </form>
  ))
}));

jest.mock('@/app/net-worth/holding-snapshots', () => ({
  HoldingSnapshotInputs: jest.fn(({ editingFormData, onChange }: { editingFormData?: HoldingSnapshotFormData; onChange: (field: string, value: unknown) => void }) => (
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
  )),
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

  it('renders form with correct header for new holding snapshot', () => {
    render(<HoldingSnapshotForm formState={mockFormState} />);
    
    expect(screen.getByTestId('form-template')).toBeInTheDocument();
    expect(screen.getByText(`New ${HOLDING_SNAPSHOT_ITEM_NAME}`)).toBeInTheDocument();
    expect(screen.getByTestId('holding-snapshot-inputs')).toBeInTheDocument();
  });

  it('renders form with correct header for edit holding snapshot', () => {
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
    
    expect(screen.getByText(`Edit ${HOLDING_SNAPSHOT_ITEM_NAME}`)).toBeInTheDocument();
  });

}); 