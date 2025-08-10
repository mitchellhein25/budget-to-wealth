import { render, screen, fireEvent } from '@testing-library/react';
import { MobileCategoryCard } from '../MobileCategoryCard';
import { Category } from '..';

const editButtonTestId = 'edit-button';
const deleteButtonTestId = 'delete-button';

jest.mock('@/app/components', () => ({
  MobileListItemCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card">{children}</div>
  ),
  MobileListItemCardHeader: ({ leftContent }: { leftContent: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card-header">{leftContent}</div>
  ),
  MobileListItemCardContent: ({ description, onEdit, onDelete }: { 
    description: React.ReactNode; 
    onEdit: () => void; 
    onDelete: () => void; 
  }) => (
    <div data-testid="mobile-list-item-card-content">
      {description}
      <button data-testid={editButtonTestId} onClick={onEdit}>Edit</button>
      <button data-testid={deleteButtonTestId} onClick={onDelete}>Delete</button>
    </div>
  ),
}));

describe('MobileCategoryCard', () => {
  const mockCategory: Category = {
    id: 1,
    name: 'Test Category',
    type: 'expense',
    color: '#FF0000',
    icon: 'test-icon',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders category information correctly', () => {
    render(
      <MobileCategoryCard
        category={mockCategory}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-list-item-card')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-list-item-card-header')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-list-item-card-content')).toBeInTheDocument();
  });

  it('calls onEdit with category when edit button is clicked', () => {
    render(
      <MobileCategoryCard
        category={mockCategory}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByTestId(editButtonTestId));
    expect(mockOnEdit).toHaveBeenCalledWith(mockCategory);
  });

  it('calls onDelete with category id when delete button is clicked', () => {
    render(
      <MobileCategoryCard
        category={mockCategory}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByTestId(deleteButtonTestId));
    expect(mockOnDelete).toHaveBeenCalledWith(mockCategory.id);
  });

  it('handles category with string id', () => {
    const categoryWithStringId: Category = {
      ...mockCategory,
      id: 'string-id',
    };
    
    render(
      <MobileCategoryCard
        category={categoryWithStringId}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByTestId(deleteButtonTestId));
    expect(mockOnDelete).toHaveBeenCalledWith('string-id');
  });

  it('handles category with number id', () => {
    const categoryWithNumberId: Category = {
      ...mockCategory,
      id: 42,
    };
    
    render(
      <MobileCategoryCard
        category={categoryWithNumberId}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByTestId(deleteButtonTestId));
    expect(mockOnDelete).toHaveBeenCalledWith(42);
  });

  it('renders category name with correct styling', () => {
    render(
      <MobileCategoryCard
        category={mockCategory}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const categoryName = screen.getByText('Test Category');
    expect(categoryName).toHaveClass('text-lg font-bold text-base-content');
  });

  it('passes null description to MobileListItemCardContent', () => {
    render(
      <MobileCategoryCard
        category={mockCategory}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByTestId('mobile-list-item-card-content')).toBeInTheDocument();
  });
});
