import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HoldingSnapshotsList } from '../HoldingSnapshotsList';
import { HoldingSnapshot } from '@/app/net-worth/components';
import { convertCentsToDollars } from '@/app/components';
import { deleteHoldingSnapshot } from '@/app/lib/api/data-methods';

// Mock the dependencies
jest.mock('@/app/components', () => ({
  convertCentsToDollars: jest.fn()
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  deleteHoldingSnapshot: jest.fn()
}));

jest.mock('@/app/components/table/ListTable', () => ({
  ListTable: ({ title, headerRow, bodyRow, items, isError, isLoading }: { title: string; headerRow: React.ReactNode; bodyRow: (item: HoldingSnapshot) => React.ReactNode; items: HoldingSnapshot[]; isError: boolean; isLoading: boolean }) => (
    <div data-testid="list-table">
      <h2>{title}</h2>
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isError && <div data-testid="error">Error loading data</div>}
      {!isLoading && !isError && (
        <>
          <table>
            <thead>{headerRow}</thead>
            <tbody>
              {items.map((item: HoldingSnapshot) => bodyRow(item))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}));

jest.mock('lucide-react', () => ({
  Pencil: ({ size }: { size?: number }) => <span data-testid="pencil-icon" style={{ fontSize: size }}>Edit</span>,
  Trash2: ({ size }: { size?: number }) => <span data-testid="trash-icon" style={{ fontSize: size }}>Delete</span>
}));

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true
});

describe('HoldingSnapshotsList', () => {
  const mockConvertCentsToDollars = convertCentsToDollars as jest.MockedFunction<(cents: number) => string>;
  const mockDeleteHoldingSnapshot = deleteHoldingSnapshot as jest.MockedFunction<(id: number) => Promise<{ successful: boolean; data: unknown; responseMessage: string }>>;
  const mockOnSnapshotDeleted = jest.fn();
  const mockOnSnapshotIsEditing = jest.fn();

  const mockSnapshots: HoldingSnapshot[] = [
    {
      id: 1,
      holdingId: 'holding-1',
      holding: {
        id: 1,
        name: 'Test Holding',
        type: 'Asset',
        holdingCategoryId: 'category-1',
        holdingCategory: {
          id: 1,
          name: 'Investment',
          type: 'Asset'
        },
        institution: 'Test Bank'
      },
      date: '2024-01-15',
      balance: 100000
    },
    {
      id: 2,
      holdingId: 'holding-2',
      holding: {
        id: 2,
        name: 'Another Holding',
        type: 'Debt',
        holdingCategoryId: 'category-2',
        holdingCategory: {
          id: 2,
          name: 'Credit Card',
          type: 'Debt'
        },
        institution: 'Credit Union'
      },
      date: '2024-01-16',
      balance: 50000
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockConvertCentsToDollars.mockReturnValue('$1,000.00');
    mockDeleteHoldingSnapshot.mockResolvedValue({ successful: true });
    mockConfirm.mockReturnValue(true);
  });

  it('renders component with title', () => {
    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    expect(screen.getByText('Holding Snapshots')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={true}
        isError={false}
      />
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('displays error state', () => {
    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={true}
      />
    );

    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('renders snapshots data correctly', () => {
    mockConvertCentsToDollars
      .mockReturnValueOnce('$1,000.00')
      .mockReturnValueOnce('$500.00');

    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    expect(screen.getByText('Test Holding - Test Bank - Investment (Asset)')).toBeInTheDocument();
    expect(screen.getByText('Another Holding - Credit Union - Credit Card (Debt)')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('2024-01-16')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('calls convertCentsToDollars for each snapshot balance', () => {
    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    expect(mockConvertCentsToDollars).toHaveBeenCalledWith(100000);
    expect(mockConvertCentsToDollars).toHaveBeenCalledWith(50000);
  });

  it('handles edit button click', () => {
    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    const editButtons = screen.getAllByTestId('pencil-icon');
    fireEvent.click(editButtons[0]);

    expect(mockOnSnapshotIsEditing).toHaveBeenCalledWith(mockSnapshots[0]);
  });

  it('handles delete button click with confirmation', async () => {
    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    const deleteButtons = screen.getAllByTestId('trash-icon');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
    expect(mockDeleteHoldingSnapshot).toHaveBeenCalledWith(1);
    
    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mockOnSnapshotDeleted).toHaveBeenCalled();
  });

  it('does not delete when user cancels confirmation', async () => {
    mockConfirm.mockReturnValue(false);

    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    const deleteButtons = screen.getAllByTestId('trash-icon');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
    expect(mockDeleteHoldingSnapshot).not.toHaveBeenCalled();
    expect(mockOnSnapshotDeleted).not.toHaveBeenCalled();
  });

  it('does not call onSnapshotDeleted when delete fails', async () => {
    mockDeleteHoldingSnapshot.mockResolvedValue({ successful: false });

    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    const deleteButtons = screen.getAllByTestId('trash-icon');
    fireEvent.click(deleteButtons[0]);

    expect(mockDeleteHoldingSnapshot).toHaveBeenCalledWith(1);
    expect(mockOnSnapshotDeleted).not.toHaveBeenCalled();
  });

  it('handles snapshots without holding data', () => {
    const snapshotsWithoutHolding = [
      {
        id: 1,
        holdingId: 'holding-1',
        holding: undefined,
        date: '2024-01-15',
        balance: 100000
      }
    ];

    render(
      <HoldingSnapshotsList
        snapshots={snapshotsWithoutHolding}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    expect(screen.getByTestId('list-table')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('handles snapshots without institution', () => {
    const snapshotsWithoutInstitution = [
      {
        id: 1,
        holdingId: 'holding-1',
        holding: {
          id: 1,
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: 'category-1',
          holdingCategory: {
            id: 1,
            name: 'Investment',
            type: 'Asset'
          },
          institution: undefined
        },
        date: '2024-01-15',
        balance: 100000
      }
    ];

    render(
      <HoldingSnapshotsList
        snapshots={snapshotsWithoutInstitution}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    expect(screen.getByTestId('list-table')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('handles snapshots without holding category', () => {
    const snapshotsWithoutCategory = [
      {
        id: 1,
        holdingId: 'holding-1',
        holding: {
          id: 1,
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: 'category-1',
          holdingCategory: undefined,
          institution: 'Test Bank'
        },
        date: '2024-01-15',
        balance: 100000
      }
    ];

    render(
      <HoldingSnapshotsList
        snapshots={snapshotsWithoutCategory}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    expect(screen.getByTestId('list-table')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('handles empty snapshots array', () => {
    render(
      <HoldingSnapshotsList
        snapshots={[]}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    expect(screen.getByText('Holding Snapshots')).toBeInTheDocument();
    expect(screen.getByTestId('list-table')).toBeInTheDocument();
  });

  it('renders edit and delete buttons for each snapshot', () => {
    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    const editButtons = screen.getAllByTestId('pencil-icon');
    const deleteButtons = screen.getAllByTestId('trash-icon');

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('handles multiple edit button clicks', () => {
    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    const editButtons = screen.getAllByTestId('pencil-icon');
    fireEvent.click(editButtons[0]);
    fireEvent.click(editButtons[1]);

    expect(mockOnSnapshotIsEditing).toHaveBeenCalledWith(mockSnapshots[0]);
    expect(mockOnSnapshotIsEditing).toHaveBeenCalledWith(mockSnapshots[1]);
  });

  it('handles multiple delete button clicks', async () => {
    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    const deleteButtons = screen.getAllByTestId('trash-icon');
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(deleteButtons[1]);

    expect(mockDeleteHoldingSnapshot).toHaveBeenCalledWith(1);
    expect(mockDeleteHoldingSnapshot).toHaveBeenCalledWith(2);
    
    // Wait for the async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mockOnSnapshotDeleted).toHaveBeenCalledTimes(2);
  });

  it('handles date formatting correctly', () => {
    const snapshotsWithDifferentDates = [
      {
        id: 1,
        holdingId: 'holding-1',
        holding: {
          id: 1,
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: 'category-1',
          holdingCategory: {
            id: 1,
            name: 'Investment',
            type: 'Asset'
          },
          institution: 'Test Bank'
        },
        date: '2024-12-31',
        balance: 100000
      }
    ];

    render(
      <HoldingSnapshotsList
        snapshots={snapshotsWithDifferentDates}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    expect(screen.getByText('2024-12-31')).toBeInTheDocument();
  });

  it('handles different balance amounts', () => {
    const snapshotsWithDifferentBalances = [
      {
        id: 1,
        holdingId: 'holding-1',
        holding: {
          id: 1,
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: 'category-1',
          holdingCategory: {
            id: 1,
            name: 'Investment',
            type: 'Asset'
          },
          institution: 'Test Bank'
        },
        date: '2024-01-15',
        balance: 0
      },
      {
        id: 2,
        holdingId: 'holding-2',
        holding: {
          id: 2,
          name: 'Another Holding',
          type: 'Debt',
          holdingCategoryId: 'category-2',
          holdingCategory: {
            id: 2,
            name: 'Credit Card',
            type: 'Debt'
          },
          institution: 'Credit Union'
        },
        date: '2024-01-16',
        balance: 123456
      }
    ];

    mockConvertCentsToDollars
      .mockReturnValueOnce('$0.00')
      .mockReturnValueOnce('$1,234.56');

    render(
      <HoldingSnapshotsList
        snapshots={snapshotsWithDifferentBalances}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    expect(mockConvertCentsToDollars).toHaveBeenCalledWith(0);
    expect(mockConvertCentsToDollars).toHaveBeenCalledWith(123456);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });
}); 