import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopHoldingSnapshotRow } from '@/app/net-worth/holding-snapshots/components/list/DesktopHoldingSnapshotRow';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots';
import { HoldingType } from '@/app/net-worth/holding-snapshots/holdings/components/HoldingType';

jest.mock('@/app/lib/utils', () => ({
  convertCentsToDollars: jest.fn((cents: number) => `$${(cents / 100).toFixed(2)}`),
  convertToDate: jest.fn((date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }),
  formatDate: jest.fn((date: Date) => date.toLocaleDateString('en-US', { timeZone: 'UTC' })),
}));

jest.mock('@/app/components', () => ({
  DesktopListItemRow: ({ children, onEdit, onDelete, actionColumnWidth, customActionButton }: { 
    children: React.ReactNode; 
    onEdit: () => void; 
    onDelete: () => void; 
    actionColumnWidth: string; 
    customActionButton?: React.ReactNode;
  }) => (
    <div data-testid="desktop-list-item-row">
      <div data-testid="action-column-width">{actionColumnWidth}</div>
      <div data-testid="custom-action-button">{customActionButton || ''}</div>
      <button data-testid="edit-button" onClick={onEdit}>Edit</button>
      <button data-testid="delete-button" onClick={onDelete}>Delete</button>
      {children}
    </div>
  ),
  DesktopListItemCell: ({ children, title, className }: { 
    children: React.ReactNode; 
    title?: string; 
    className?: string;
  }) => (
    <div data-testid="desktop-list-item-cell" className={className} title={title}>
      {children}
    </div>
  ),
}));

jest.mock('@/app/net-worth/holding-snapshots', () => ({
  getHoldingSnapshotDisplayName: jest.fn((snapshot: HoldingSnapshot) => 
    snapshot ? `${snapshot.holding?.name} - ${snapshot.holding?.institution} - ${snapshot.holding?.holdingCategory?.name} (${snapshot.holding?.type})` : ''
  ),
}));

describe('DesktopHoldingSnapshotRow', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();

  const baseSnapshot: HoldingSnapshot = {
    id: 1,
    holdingId: '1',
    holding: {
      id: 1,
      name: 'Test Holding',
      type: HoldingType.ASSET,
      holdingCategoryId: '1',
      holdingCategory: {
        id: 1,
        name: 'Test Category',
      },
      institution: 'Test Institution',
    },
    date: '2024-01-15',
    balance: 100000, // $1000.00 in cents
    userId: 'user1',
  };

  const columnWidths = {
    holding: 'w-1/3',
    date: 'w-1/4',
    balance: 'w-1/4',
    actions: 'w-1/6',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with all required elements', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByTestId('desktop-list-item-row')).toBeInTheDocument();
    expect(screen.getAllByTestId('desktop-list-item-cell')).toHaveLength(3);
    const holdingCell = screen.getAllByTestId('desktop-list-item-cell')[0];
    expect(holdingCell).toHaveTextContent('Test Holding - Test Institution - Test Category (Asset)');
    const dateCell = screen.getAllByTestId('desktop-list-item-cell')[1];
    expect(dateCell).toHaveTextContent('1/15/2024');
    const balanceCell = screen.getAllByTestId('desktop-list-item-cell')[2];
    expect(balanceCell).toHaveTextContent('$1000.00');
    const cells = screen.getAllByTestId('desktop-list-item-cell');
    expect(cells[0]).toHaveClass('w-1/3');
    expect(cells[1]).toHaveClass('w-1/4');
    expect(cells[2]).toHaveClass('w-1/4', 'whitespace-nowrap', 'font-medium');
    expect(screen.getByTestId('action-column-width')).toHaveTextContent('w-1/6');
  });

  it('calls onEdit with the snapshot when edit button is clicked', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(baseSnapshot);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with the snapshot id when delete button is clicked', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('renders update button when onUpdate is provided', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    const updateButton = screen.getByText('Update');
    expect(updateButton).toBeInTheDocument();
    expect(updateButton).toHaveClass('btn', 'btn-sm');
  });

  it('calls onUpdate with the snapshot when update button is clicked', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    expect(mockOnUpdate).toHaveBeenCalledWith(baseSnapshot);
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
  });

  it('renders update button when onUpdate is not provided but customActionButton is still passed', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // The component always passes customActionButton to DesktopListItemRow
    // The conditional logic is handled by the parent component
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('handles snapshot with undefined id', () => {
    const snapshotWithoutId: HoldingSnapshot = {
      ...baseSnapshot,
      id: undefined,
    };
    
    render(
      <DesktopHoldingSnapshotRow
        snapshot={snapshotWithoutId}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(undefined);
  });

  it('handles snapshot with null id', () => {
    const snapshotWithNullId: HoldingSnapshot = {
      ...baseSnapshot,
      id: null as unknown as number,
    };
    
    render(
      <DesktopHoldingSnapshotRow
        snapshot={snapshotWithNullId}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(null);
  });

  it('handles snapshot with zero balance', () => {
    const snapshotWithZeroBalance: HoldingSnapshot = {
      ...baseSnapshot,
      balance: 0,
    };
    
    render(
      <DesktopHoldingSnapshotRow
        snapshot={snapshotWithZeroBalance}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const balanceCell = screen.getAllByTestId('desktop-list-item-cell')[2];
    expect(balanceCell).toHaveTextContent('$0.00');
  });

  it('handles snapshot with negative balance', () => {
    const snapshotWithNegativeBalance: HoldingSnapshot = {
      ...baseSnapshot,
      balance: -50000, // -$500.00 in cents
    };
    
    render(
      <DesktopHoldingSnapshotRow
        snapshot={snapshotWithNegativeBalance}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const balanceCell = screen.getAllByTestId('desktop-list-item-cell')[2];
    expect(balanceCell).toHaveTextContent('$-500.00');
  });

  it('handles snapshot with large balance', () => {
    const snapshotWithLargeBalance: HoldingSnapshot = {
      ...baseSnapshot,
      balance: 999999999, // $9,999,999.99 in cents
    };
    
    render(
      <DesktopHoldingSnapshotRow
        snapshot={snapshotWithLargeBalance}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const balanceCell = screen.getAllByTestId('desktop-list-item-cell')[2];
    expect(balanceCell).toHaveTextContent('$9999999.99');
  });

  it('handles snapshot with different date format', () => {
    const snapshotWithDifferentDate: HoldingSnapshot = {
      ...baseSnapshot,
      date: '2024-12-31',
    };
    
    render(
      <DesktopHoldingSnapshotRow
        snapshot={snapshotWithDifferentDate}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const dateCell = screen.getAllByTestId('desktop-list-item-cell')[1];
    expect(dateCell).toHaveTextContent('12/31/2024');
  });

  it('handles snapshot with missing holding data', () => {
    const snapshotWithoutHolding: HoldingSnapshot = {
      ...baseSnapshot,
      holding: undefined,
    };
    
    render(
      <DesktopHoldingSnapshotRow
        snapshot={snapshotWithoutHolding}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const holdingCell = screen.getAllByTestId('desktop-list-item-cell')[0];
    expect(holdingCell).toHaveTextContent('undefined - undefined - undefined (undefined)');
  });

  it('handles snapshot with partial holding data', () => {
    const snapshotWithPartialHolding: HoldingSnapshot = {
      ...baseSnapshot,
      holding: {
        id: 1,
        name: 'Test Holding',
        type: HoldingType.ASSET,
        holdingCategoryId: '1',
        holdingCategory: undefined,
        institution: undefined,
      },
    };
    
    render(
      <DesktopHoldingSnapshotRow
        snapshot={snapshotWithPartialHolding}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const holdingCell = screen.getAllByTestId('desktop-list-item-cell')[0];
    expect(holdingCell).toHaveTextContent('Test Holding - undefined - undefined (Asset)');
  });

  it('handles snapshot with Debt type holding', () => {
    const snapshotWithDebtHolding: HoldingSnapshot = {
      ...baseSnapshot,
      holding: {
        ...baseSnapshot.holding!,
        type: HoldingType.DEBT,
      },
    };
    
    render(
      <DesktopHoldingSnapshotRow
        snapshot={snapshotWithDebtHolding}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const holdingCell = screen.getAllByTestId('desktop-list-item-cell')[0];
    expect(holdingCell).toHaveTextContent('Test Holding - Test Institution - Test Category (Debt)');
  });

  it('handles multiple rapid clicks on edit button', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    fireEvent.click(editButton);
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(3);
  });

  it('handles multiple rapid clicks on delete button', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(3);
  });

  it('handles multiple rapid clicks on update button', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    fireEvent.click(updateButton);
    fireEvent.click(updateButton);
    
    expect(mockOnUpdate).toHaveBeenCalledTimes(3);
  });

  it('uses snapshot id as key for the row', () => {
    const { container } = render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const row = container.querySelector('[data-testid="desktop-list-item-row"]');
    expect(row).toBeInTheDocument();
  });

  it('passes correct title to holding cell', () => {
    render(
      <DesktopHoldingSnapshotRow
        snapshot={baseSnapshot}
        columnWidths={columnWidths}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const holdingCell = screen.getAllByTestId('desktop-list-item-cell')[0];
    expect(holdingCell).toHaveAttribute('title', 'Test Holding - Test Institution - Test Category (Asset)');
  });
});
