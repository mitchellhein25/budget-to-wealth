import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HoldingSnapshotsList } from '../HoldingSnapshotsList';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots/components';
import { deleteHoldingSnapshot } from '@/app/lib/api/data-methods';

jest.mock('@/app/hooks/useMobileDetection', () => ({
  useMobileDetection: () => ({ isMobile: false, isDesktop: true }),
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

const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true
});

describe('HoldingSnapshotsList', () => {
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
          name: 'Investment'
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
        },
        institution: 'Credit Union'
      },
      date: '2024-01-16',
      balance: 50000
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteHoldingSnapshot.mockResolvedValue({ successful: true, data: null, responseMessage: 'Deleted successfully' });
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

    const editButtons = screen.getAllByText('Edit');
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

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
    expect(mockDeleteHoldingSnapshot).toHaveBeenCalledWith(1);
    
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

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
    expect(mockDeleteHoldingSnapshot).not.toHaveBeenCalled();
    expect(mockOnSnapshotDeleted).not.toHaveBeenCalled();
  });

  it('does not call onSnapshotDeleted when delete fails', async () => {
    mockDeleteHoldingSnapshot.mockResolvedValue({ successful: false, data: null, responseMessage: 'Delete failed' });

    render(
      <HoldingSnapshotsList
        snapshots={mockSnapshots}
        onSnapshotDeleted={mockOnSnapshotDeleted}
        onSnapshotIsEditing={mockOnSnapshotIsEditing}
        isLoading={false}
        isError={false}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockDeleteHoldingSnapshot).toHaveBeenCalledWith(1);
    expect(mockOnSnapshotDeleted).not.toHaveBeenCalled();
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

    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
}); 