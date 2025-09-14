import { render, screen, fireEvent } from '@testing-library/react';
import { Category } from '@/app/components';
import { DesktopCategoryRow } from '@/app/components/categories/list/DesktopCategoryRow';

const editButtonTestId = 'edit-button';
const deleteButtonTestId = 'delete-button';

jest.mock('@/app/components', () => ({
  DesktopListItemRow: ({ children, onEdit, onDelete }: { 
    children: React.ReactNode; 
    onEdit: () => void; 
    onDelete: () => void; 
  }) => (
    <div data-testid="desktop-list-item-row">
      <button data-testid={editButtonTestId} onClick={onEdit}>Edit</button>
      <button data-testid={deleteButtonTestId} onClick={onDelete}>Delete</button>
      {children}
    </div>
  ),
  DesktopListItemCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="desktop-list-item-cell">{children}</div>
  ),
  CategoriesInputs: () => <div>CategoriesInputs</div>,
}));

describe('DesktopCategoryRow', () => {
  const mockCategory: Category = {
    id: 1,
    name: 'Test Category',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders category information correctly', () => {
    render(
      <DesktopCategoryRow
        category={mockCategory}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-list-item-row')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-list-item-cell')).toBeInTheDocument();
  });

  it('calls onEdit with category when edit button is clicked', () => {
    render(
      <DesktopCategoryRow
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
      <DesktopCategoryRow
        category={mockCategory}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByTestId(deleteButtonTestId));
    expect(mockOnDelete).toHaveBeenCalledWith(mockCategory.id);
  });

  it('handles category with id', () => {
    const categoryWithStringId: Category = {
      ...mockCategory,
      id: 1,
    };
    
    render(
      <DesktopCategoryRow
        category={categoryWithStringId}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByTestId(deleteButtonTestId));
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('handles category with number id', () => {
    const categoryWithNumberId: Category = {
      ...mockCategory,
      id: 42,
    };
    
    render(
      <DesktopCategoryRow
        category={categoryWithNumberId}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByTestId(deleteButtonTestId));
    expect(mockOnDelete).toHaveBeenCalledWith(42);
  });
});
