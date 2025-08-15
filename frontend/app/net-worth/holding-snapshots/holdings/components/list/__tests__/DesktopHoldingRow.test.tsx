import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopHoldingRow } from '../DesktopHoldingRow';
import { Holding } from '../../Holding';

const editButtonText = 'Edit';
const deleteButtonText = 'Delete';

jest.mock('@/app/components', () => ({
  DesktopListItemRow: ({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <tr data-testid="desktop-row">
      {children}
      <td>
        <button onClick={onEdit}>{editButtonText}</button>
        <button onClick={onDelete}>{deleteButtonText}</button>
      </td>
    </tr>
  ),
  DesktopListItemCell: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <td data-testid="desktop-cell" title={title}>{children}</td>
  ),
}));

describe('DesktopHoldingRow', () => {
  const baseHolding: Holding = {
    id: 1,
    name: 'Test Holding',
    type: 'Asset',
    holdingCategoryId: '1',
    holdingCategory: { id: 1, name: 'Category A' },
    institution: 'Test Bank',
  };

  it('renders holding fields correctly', () => {
    render(
      <table><tbody>
        <DesktopHoldingRow holding={baseHolding} onEdit={jest.fn()} onDelete={jest.fn()} />
      </tbody></table>
    );

    expect(screen.getByText(baseHolding.name)).toBeInTheDocument();
    expect(screen.getByText(baseHolding.institution as string)).toBeInTheDocument();
    expect(screen.getByText(baseHolding.holdingCategory?.name as string)).toBeInTheDocument();
    const typeBadge = screen.getByText(baseHolding.type);
    expect(typeBadge).toBeInTheDocument();
    expect(typeBadge).toHaveClass('badge');
    expect(typeBadge).toHaveClass('badge-success');
  });

  it('renders debt type with error badge class', () => {
    const debtHolding: Holding = { ...baseHolding, type: 'Debt' };
    render(
      <table><tbody>
        <DesktopHoldingRow holding={debtHolding} onEdit={jest.fn()} onDelete={jest.fn()} />
      </tbody></table>
    );
    const typeBadge = screen.getByText('Debt');
    expect(typeBadge).toHaveClass('badge-error');
  });

  it('does not render institution or category when not provided', () => {
    const minimalHolding: Holding = {
      id: 2,
      name: 'No Extras',
      type: 'Asset',
      holdingCategoryId: '1',
    } as Holding;

    render(
      <table><tbody>
        <DesktopHoldingRow holding={minimalHolding} onEdit={jest.fn()} onDelete={jest.fn()} />
      </tbody></table>
    );

    expect(screen.getByText('No Extras')).toBeInTheDocument();
    expect(screen.queryByText('Test Bank')).not.toBeInTheDocument();
    expect(screen.queryByText('Category A')).not.toBeInTheDocument();
  });

  it('invokes edit and delete callbacks with correct arguments', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <table><tbody>
        <DesktopHoldingRow holding={baseHolding} onEdit={onEdit} onDelete={onDelete} />
      </tbody></table>
    );

    fireEvent.click(screen.getByText(editButtonText));
    expect(onEdit).toHaveBeenCalledWith(baseHolding);

    fireEvent.click(screen.getByText(deleteButtonText));
    expect(onDelete).toHaveBeenCalledWith(baseHolding.id);
  });
});


