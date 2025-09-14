import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileHoldingCard } from '@/app/net-worth/holding-snapshots/holdings/components/list/MobileHoldingCard';
import { Holding } from '@/app/net-worth/holding-snapshots/holdings';
import { HoldingType } from '@/app/net-worth/holding-snapshots/holdings/components/HoldingType';

jest.mock('@/app/components', () => ({
  MobileListItemCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card">{children}</div>
  ),
  MobileListItemCardHeader: ({ leftContent, rightContent }: { leftContent: React.ReactNode; rightContent?: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card-header">
      <div data-testid="left-content">{leftContent}</div>
      {rightContent && <div data-testid="right-content">{rightContent}</div>}
    </div>
  ),
  MobileListItemCardContent: ({ description, onEdit, onDelete }: { description?: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <div data-testid="mobile-list-item-card-content">
      {description && <div data-testid="description">{description}</div>}
      <button data-testid="edit-button" onClick={onEdit}>Edit</button>
      <button data-testid="delete-button" onClick={onDelete}>Delete</button>
    </div>
  ),
}));

describe('MobileHoldingCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const baseHolding: Holding = {
    id: 1,
    name: 'Test Holding',
    type: HoldingType.ASSET,
    holdingCategoryId: '1',
    holdingCategory: {
      id: '1',
      name: 'Test Category',
    },
    institution: 'Test Institution',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with all required elements', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByTestId('mobile-list-item-card')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-list-item-card-header')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-list-item-card-content')).toBeInTheDocument();
  });

  it('displays the holding name', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Test Holding')).toBeInTheDocument();
  });

  it('displays the holding type as a badge', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Asset')).toBeInTheDocument();
  });

  it('applies success badge class for Asset type', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const badge = screen.getByText('Asset');
    expect(badge).toHaveClass('badge-success');
  });

  it('applies error badge class for Debt type', () => {
    const debtHolding: Holding = {
      ...baseHolding,
      type: HoldingType.DEBT,
    };
    
    render(<MobileHoldingCard holding={debtHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const badge = screen.getByText('Debt');
    expect(badge).toHaveClass('badge-error');
  });

  it('displays holding category when available', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('does not display holding category when not available', () => {
    const holdingWithoutCategory: Holding = {
      ...baseHolding,
      holdingCategory: undefined,
    };
    
    render(<MobileHoldingCard holding={holdingWithoutCategory} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.queryByText('Test Category')).not.toBeInTheDocument();
  });

  it('displays institution when available', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Test Institution')).toBeInTheDocument();
  });

  it('does not display institution when not available', () => {
    const holdingWithoutInstitution: Holding = {
      ...baseHolding,
      institution: undefined,
    };
    
    render(<MobileHoldingCard holding={holdingWithoutInstitution} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.queryByText('Test Institution')).not.toBeInTheDocument();
  });

  it('calls onEdit with the holding when edit button is clicked', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(baseHolding);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with the holding id when delete button is clicked', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('handles holding with undefined id', () => {
    const holdingWithoutId: Holding = {
      ...baseHolding,
      id: undefined,
    };
    
    render(<MobileHoldingCard holding={holdingWithoutId} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(undefined);
  });

  it('handles holding with null id', () => {
    const holdingWithNullId: Holding = {
      ...baseHolding,
      id: null as unknown as number,
    };
    
    render(<MobileHoldingCard holding={holdingWithNullId} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(null);
  });

  it('handles holding with empty string name', () => {
    const holdingWithEmptyName: Holding = {
      ...baseHolding,
      name: '',
    };
    
    render(<MobileHoldingCard holding={holdingWithEmptyName} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const nameElement = screen.getByTestId('left-content').querySelector('.text-lg.font-bold.text-base-content');
    expect(nameElement).toBeInTheDocument();
    expect(nameElement).toHaveTextContent('');
  });

  it('handles holding with long institution name', () => {
    const holdingWithLongInstitution: Holding = {
      ...baseHolding,
      institution: 'This is a very long institution name that should be handled properly by the component',
    };
    
    render(<MobileHoldingCard holding={holdingWithLongInstitution} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const institutionElement = screen.getByText(holdingWithLongInstitution.institution!);
    expect(institutionElement).toBeInTheDocument();
    expect(institutionElement).toHaveClass('break-words');
    expect(institutionElement).toHaveAttribute('title', holdingWithLongInstitution.institution);
  });

  it('handles holding with special characters in name', () => {
    const holdingWithSpecialChars: Holding = {
      ...baseHolding,
      name: 'Test & Holding <script>alert("xss")</script>',
    };
    
    render(<MobileHoldingCard holding={holdingWithSpecialChars} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText(holdingWithSpecialChars.name)).toBeInTheDocument();
  });

  it('handles holding with special characters in category name', () => {
    const holdingWithSpecialCategory: Holding = {
      ...baseHolding,
      holdingCategory: {
        id: '1',
        name: 'Test & Category <script>alert("xss")</script>',
      },
    };
    
    render(<MobileHoldingCard holding={holdingWithSpecialCategory} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText(holdingWithSpecialCategory.holdingCategory!.name)).toBeInTheDocument();
  });

  it('handles holding with special characters in institution', () => {
    const holdingWithSpecialInstitution: Holding = {
      ...baseHolding,
      institution: 'Test & Institution <script>alert("xss")</script>',
    };
    
    render(<MobileHoldingCard holding={holdingWithSpecialInstitution} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const institutionElement = screen.getByText(holdingWithSpecialInstitution.institution!);
    expect(institutionElement).toBeInTheDocument();
    expect(institutionElement).toHaveAttribute('title', holdingWithSpecialInstitution.institution);
  });

  it('handles holding with empty institution string', () => {
    const holdingWithEmptyInstitution: Holding = {
      ...baseHolding,
      institution: '',
    };
    
    render(<MobileHoldingCard holding={holdingWithEmptyInstitution} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.queryByTestId('description')).not.toBeInTheDocument();
  });

  it('handles holding with empty category name', () => {
    const holdingWithEmptyCategory: Holding = {
      ...baseHolding,
      holdingCategory: {
        id: '1',
        name: '',
      },
    };
    
    render(<MobileHoldingCard holding={holdingWithEmptyCategory} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    // When category name is empty, the rightContent should not be rendered due to the conditional logic
    expect(screen.queryByTestId('right-content')).not.toBeInTheDocument();
  });

  it('handles multiple rapid clicks on edit button', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    fireEvent.click(editButton);
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(3);
  });

  it('handles multiple rapid clicks on delete button', () => {
    render(<MobileHoldingCard holding={baseHolding} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(3);
  });
});
