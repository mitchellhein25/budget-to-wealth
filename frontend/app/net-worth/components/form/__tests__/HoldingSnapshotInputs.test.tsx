import React from 'react';
import { render, screen } from '@testing-library/react';
import { HoldingSnapshotInputs } from '../HoldingSnapshotInputs';
import { HoldingSnapshotFormData } from '../HoldingSnapshotFormData';

// Mock the dependencies
jest.mock('@/app/lib/api/data-methods', () => ({
  getAllHoldings: jest.fn().mockResolvedValue({
    successful: true,
    data: []
  })
}));

jest.mock('@/app/components/form', () => ({
  InputFieldSetTemplate: ({ label, isRequired, inputChild }: any) => (
    <div data-testid={`input-field-${label.toLowerCase()}`}>
      <label>{label}</label>
      <span data-testid="required-indicator">{isRequired ? 'required' : 'optional'}</span>
      {inputChild}
    </div>
  )
}));

jest.mock('@/app/components', () => ({
  convertDateToISOString: (date: Date) => date.toISOString().split('T')[0]
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

jest.mock('lucide-react', () => ({
  Edit: ({ size }: any) => <span data-testid="edit-icon" style={{ fontSize: size }}>Edit</span>
}));

describe('HoldingSnapshotInputs', () => {
  const mockProps = {
    editingFormData: {
      id: undefined,
      holdingId: '',
      date: new Date('2024-01-15'),
      balance: ''
    } as Partial<HoldingSnapshotFormData>,
    onChange: jest.fn(),
    setIsLoading: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required input fields', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    expect(screen.getByTestId('input-field-holding')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-date')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-balance')).toBeInTheDocument();
  });

  it('marks all fields as required', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    const requiredIndicators = screen.getAllByTestId('required-indicator');
    expect(requiredIndicators).toHaveLength(3);
    requiredIndicators.forEach(indicator => {
      expect(indicator).toHaveTextContent('required');
    });
  });

  it('displays correct field labels', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    expect(screen.getByText('Holding')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
  });

  it('displays edit holdings link', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    const editLink = screen.getByRole('link', { name: /edit/i });
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute('href', '/net-worth/holdings');
  });

  it('displays edit icon', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('displays provided date when available', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
  });

  it('displays balance placeholder', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('displays provided balance value', () => {
    const propsWithBalance = {
      ...mockProps,
      editingFormData: {
        ...mockProps.editingFormData,
        balance: '1000.50'
      }
    };

    render(<HoldingSnapshotInputs {...propsWithBalance} />);
    
    expect(screen.getByDisplayValue('1000.50')).toBeInTheDocument();
  });

  it('handles empty balance value', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    const balanceInput = screen.getByPlaceholderText('0.00');
    expect(balanceInput).toHaveDisplayValue('');
  });

  it('renders component successfully', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    expect(screen.getByTestId('input-field-holding')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-date')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-balance')).toBeInTheDocument();
  });

  it('displays id value when provided', () => {
    const propsWithId = {
      ...mockProps,
      editingFormData: {
        ...mockProps.editingFormData,
        id: 'snapshot-123'
      }
    };

    render(<HoldingSnapshotInputs {...propsWithId} />);
    
    expect(screen.getByDisplayValue('snapshot-123')).toBeInTheDocument();
  });

  it('calls setIsLoading when component mounts', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    
    expect(mockProps.setIsLoading).toHaveBeenCalledWith(true);
  });
}); 