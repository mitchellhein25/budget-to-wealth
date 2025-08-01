import React from 'react';
import { render, screen } from '@testing-library/react';
import { HoldingSnapshotInputs } from '../HoldingSnapshotInputs';
import { HoldingSnapshotFormData } from '../HoldingSnapshotFormData';
import { act } from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';

// Mock getAllHoldings globally before imports
jest.mock('@/app/lib/api/data-methods', () => ({
  getAllHoldings: jest.fn().mockResolvedValue({ successful: true, data: [] })
}));

// Unmock InputFieldSetTemplate for the entire file
jest.unmock('@/app/components/form');

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
    expect(screen.getByText('Holding')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
  });

  it('marks all fields as required', () => {
    render(<HoldingSnapshotInputs {...mockProps} />);
    const requiredLabels = screen.getAllByText('Required');
    expect(requiredLabels).toHaveLength(3);
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
    expect(screen.getByText('Holding')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
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

  it('displays today\'s date if editingFormData.date is undefined', () => {
    render(<HoldingSnapshotInputs {...mockProps} editingFormData={{ ...mockProps.editingFormData, date: undefined }} />);
    const dateInput = document.getElementById('holding-snapshot-date') as HTMLInputElement;
    expect(dateInput).toBeTruthy();
    expect(dateInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dateInput.value).not.toBe('');
  });

  it('renders holding options when holdings are returned', async () => {
    const holdings = [
      { id: 'h1', name: 'Account 1', institution: 'Bank', holdingCategory: { name: 'Cat' }, type: 'Cash' },
      { id: 'h2', name: 'Account 2', institution: '', holdingCategory: { name: 'Cat2' }, type: 'Stock' },
    ];
    const { getAllHoldings } = require('@/app/lib/api/data-methods');
    getAllHoldings.mockResolvedValueOnce({ successful: true, data: holdings });
    render(<HoldingSnapshotInputs {...mockProps} />);
    await screen.findByText((content) => content.replace(/\s+/g, ' ').includes('Account 1 - Bank - Cat (Cash)'));
    await screen.findByText((content) => content.replace(/\s+/g, ' ').includes('Account 2 - Cat2 (Stock)'));
  });

  it('does not set holdings if fetch is unsuccessful', async () => {
    const { getAllHoldings } = require('@/app/lib/api/data-methods');
    getAllHoldings.mockResolvedValueOnce({ successful: false, data: [] });
    render(<HoldingSnapshotInputs {...mockProps} />);
    // There should only be the default option
    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Pick a holding');
  });
}); 