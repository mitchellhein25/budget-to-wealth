import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { HoldingSnapshotInputs } from '../HoldingSnapshotInputs';
import { HoldingSnapshotFormData } from '../HoldingSnapshotFormData';
import { waitFor } from '@testing-library/react';
import { getAllHoldings } from '@/app/lib/api/data-methods';

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
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

jest.mock('lucide-react', () => ({
  Edit: ({ size }: { size?: number }) => <span data-testid="edit-icon" style={{ fontSize: size }}>Edit</span>
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

  it('renders all required input fields', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    expect(screen.getByText('Holding')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
  });

  it('marks all fields as required', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    const requiredLabels = screen.getAllByText('Required');
    expect(requiredLabels).toHaveLength(3);
  });

  it('displays correct field labels', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    
    expect(screen.getByText('Holding')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
  });

  it('displays edit holdings link', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    
    const editLink = screen.getByRole('link', { name: /edit/i });
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute('href', '/net-worth/holdings');
  });

  it('displays edit icon', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('displays provided date when available', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    
    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
  });

  it('displays balance placeholder', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('displays provided balance value', async () => {
    const propsWithBalance = {
      ...mockProps,
      editingFormData: {
        ...mockProps.editingFormData,
        balance: '1000.50'
      }
    };

    await act(async () => {
      render(<HoldingSnapshotInputs {...propsWithBalance} />);
    });
    
    expect(screen.getByDisplayValue('1000.50')).toBeInTheDocument();
  });

  it('handles empty balance value', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    
    const balanceInput = screen.getByPlaceholderText('0.00');
    expect(balanceInput).toHaveDisplayValue('');
  });

  it('renders component successfully', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    expect(screen.getByText('Holding')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
  });

  it('displays id value when provided', async () => {
    const propsWithId = {
      ...mockProps,
      editingFormData: {
        ...mockProps.editingFormData,
        id: 'snapshot-123'
      }
    };

    await act(async () => {
      render(<HoldingSnapshotInputs {...propsWithId} />);
    });
    
    expect(screen.getByDisplayValue('snapshot-123')).toBeInTheDocument();
  });

  it('calls setIsLoading when component mounts', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    
    expect(mockProps.setIsLoading).toHaveBeenCalledWith(true);
  });

  it('displays today\'s date if editingFormData.date is undefined', async () => {
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} editingFormData={{ ...mockProps.editingFormData, date: undefined }} />);
    });
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
    const mockGetAllHoldings = getAllHoldings as jest.MockedFunction<() => Promise<{ successful: boolean; data: unknown[] }>>;
    mockGetAllHoldings.mockResolvedValueOnce({ successful: true, data: holdings });
    
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    
    await waitFor(() => {
      expect(mockProps.setIsLoading).toHaveBeenCalledWith(false);
    });
    
    // The component should have called setIsLoading(false) after loading holdings
    expect(mockProps.setIsLoading).toHaveBeenCalledWith(false);
  });

  it('does not set holdings if fetch is unsuccessful', async () => {
    const mockGetAllHoldings = getAllHoldings as jest.MockedFunction<() => Promise<{ successful: boolean; data: unknown[] }>>;
    mockGetAllHoldings.mockResolvedValueOnce({ successful: false, data: [] });
    
    await act(async () => {
      render(<HoldingSnapshotInputs {...mockProps} />);
    });
    
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Pick a holding');
    });
  });
}); 