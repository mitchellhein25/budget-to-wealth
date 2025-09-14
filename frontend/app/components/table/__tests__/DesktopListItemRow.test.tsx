import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopListItemRow } from '@/app/components/table/DesktopListItemRow';

jest.mock('@/app/components', () => ({
  EditButton: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="edit-button" onClick={onClick}>
      Edit
    </button>
  ),
  DeleteButton: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="delete-button" onClick={onClick}>
      Delete
    </button>
  ),
}));

describe('DesktopListItemRow', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockChildren = <td data-testid="test-cell">Test content</td>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(
      <table>
        <tbody>
          <DesktopListItemRow onEdit={mockOnEdit} onDelete={mockOnDelete}>
            {mockChildren}
          </DesktopListItemRow>
        </tbody>
      </table>
    );

    const row = screen.getByRole('row');
    expect(row).toBeInTheDocument();
    expect(row).toHaveClass('hover');
    expect(screen.getByTestId('test-cell')).toBeInTheDocument();
    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <table>
        <tbody>
          <DesktopListItemRow 
            onEdit={mockOnEdit} 
            onDelete={mockOnDelete}
            className="custom-class"
          >
            {mockChildren}
          </DesktopListItemRow>
        </tbody>
      </table>
    );

    const row = screen.getByRole('row');
    expect(row).toHaveClass('hover', 'custom-class');
  });

  it('renders with custom action column width', () => {
    render(
      <table>
        <tbody>
          <DesktopListItemRow 
            onEdit={mockOnEdit} 
            onDelete={mockOnDelete}
            actionColumnWidth="w-1/6"
          >
            {mockChildren}
          </DesktopListItemRow>
        </tbody>
      </table>
    );

    const actionCell = screen.getByRole('row').querySelector('td:last-child');
    expect(actionCell).toHaveClass('w-1/6', 'text-center', 'overflow-hidden');
  });

  it('renders with default action column width when not provided', () => {
    render(
      <table>
        <tbody>
          <DesktopListItemRow onEdit={mockOnEdit} onDelete={mockOnDelete}>
            {mockChildren}
          </DesktopListItemRow>
        </tbody>
      </table>
    );

    const actionCell = screen.getByRole('row').querySelector('td:last-child');
    expect(actionCell).toHaveClass('w-1/12', 'text-center', 'overflow-hidden');
  });

  it('renders with custom action button', () => {
    const customButton = <button data-testid="custom-button">Custom Action</button>;
    
    render(
      <table>
        <tbody>
          <DesktopListItemRow 
            onEdit={mockOnEdit} 
            onDelete={mockOnDelete}
            customActionButton={customButton}
          >
            {mockChildren}
          </DesktopListItemRow>
        </tbody>
      </table>
    );

    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <table>
        <tbody>
          <DesktopListItemRow onEdit={mockOnEdit} onDelete={mockOnDelete}>
            {mockChildren}
          </DesktopListItemRow>
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByTestId('edit-button'));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <table>
        <tbody>
          <DesktopListItemRow onEdit={mockOnEdit} onDelete={mockOnDelete}>
            {mockChildren}
          </DesktopListItemRow>
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByTestId('delete-button'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
