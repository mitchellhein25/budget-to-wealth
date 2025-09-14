import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileHoldingSnapshotCard, HoldingSnapshot } from '@/app/net-worth/holding-snapshots';

jest.mock('@/app/lib/utils', () => ({
  convertCentsToDollars: jest.fn((cents: number) => `$${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`),
  replaceSpacesWithDashes: jest.fn((text) => text.replace(/\s+/g, '-')),
}));

jest.mock('@/app/components', () => ({
  MobileListItemCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card">
      {children}
    </div>
  ),
  MobileListItemCardHeader: ({ leftContent, rightContent }: { leftContent: React.ReactNode; rightContent?: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card-header">
      <div>{leftContent}</div>
      <div>{rightContent}</div>
    </div>
  ),
  MobileListItemCardContent: ({ description, onEdit, onDelete }: { description: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <div data-testid="mobile-list-item-card-content">
      <div>{description}</div>
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  ),
}));

describe('MobileHoldingSnapshotCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockSnapshot: HoldingSnapshot = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with snapshot data', () => {
    render(
      <MobileHoldingSnapshotCard
        snapshot={mockSnapshot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('mobile-list-item-card')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-list-item-card-header')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-list-item-card-content')).toBeInTheDocument();
  });

  it('displays snapshot date correctly', () => {
    render(
      <MobileHoldingSnapshotCard
        snapshot={mockSnapshot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('displays snapshot balance correctly', () => {
    render(
      <MobileHoldingSnapshotCard
        snapshot={mockSnapshot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/\$1,000\.00/)).toBeInTheDocument();
  });

  it('displays holding information correctly', () => {
    render(
      <MobileHoldingSnapshotCard
        snapshot={mockSnapshot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Holding - Test Bank (Asset)')).toBeInTheDocument();
  });

  it('displays holding category badge when available', () => {
    render(
      <MobileHoldingSnapshotCard
        snapshot={mockSnapshot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Investment')).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    render(
      <MobileHoldingSnapshotCard
        snapshot={mockSnapshot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');

    expect(editButtons).toHaveLength(1);
    expect(deleteButtons).toHaveLength(1);
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <MobileHoldingSnapshotCard
        snapshot={mockSnapshot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockSnapshot);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <MobileHoldingSnapshotCard
        snapshot={mockSnapshot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('handles snapshot without holding data', () => {
    const snapshotWithoutHolding = {
      ...mockSnapshot,
      holding: undefined
    };

    render(
      <MobileHoldingSnapshotCard
        snapshot={snapshotWithoutHolding}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('mobile-list-item-card')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText(/\$1,000\.00/)).toBeInTheDocument();
  });

  it('handles snapshot without holding category', () => {
    const snapshotWithoutCategory = {
      ...mockSnapshot,
      holding: {
        ...mockSnapshot.holding!,
        holdingCategory: undefined
      }
    };

    render(
      <MobileHoldingSnapshotCard
        snapshot={snapshotWithoutCategory}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('mobile-list-item-card')).toBeInTheDocument();
    expect(screen.getByText('Test Holding - Test Bank (Asset)')).toBeInTheDocument();
  });

  it('handles snapshot without institution', () => {
    const snapshotWithoutInstitution = {
      ...mockSnapshot,
      holding: {
        ...mockSnapshot.holding!,
        institution: undefined
      }
    };

    render(
      <MobileHoldingSnapshotCard
        snapshot={snapshotWithoutInstitution}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('mobile-list-item-card')).toBeInTheDocument();
    expect(screen.getByText(/Test Holding/)).toBeInTheDocument();
    expect(screen.getByText(/Asset/)).toBeInTheDocument();
  });

  it('handles different balance amounts', () => {
    const snapshotWithDifferentBalance = {
      ...mockSnapshot,
      balance: 0
    };

    render(
      <MobileHoldingSnapshotCard
        snapshot={snapshotWithDifferentBalance}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('handles different date formats', () => {
    const snapshotWithDifferentDate = {
      ...mockSnapshot,
      date: '2024-12-31'
    };

    render(
      <MobileHoldingSnapshotCard
        snapshot={snapshotWithDifferentDate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('2024-12-31')).toBeInTheDocument();
  });
});
