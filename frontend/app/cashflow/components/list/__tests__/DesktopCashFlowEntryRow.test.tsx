import { render, screen, fireEvent } from '@testing-library/react';
import { Category } from '@/app/components';
import { CashFlowEntry, CashFlowType } from '@/app/cashflow';
import { DesktopCashFlowEntryRow } from '@/app/cashflow/components/list/DesktopCashFlowEntryRow';

const editLabel = 'Edit';
const deleteLabel = 'Delete';

jest.mock('@/app/lib/utils', () => ({
  convertCentsToDollars: jest.fn((cents) => `$${(cents / 100).toFixed(2)}`),
  convertToDate: jest.fn((dateString) => new Date(dateString)),
  formatDate: jest.fn((date) => date.toLocaleDateString()),
}));

jest.mock('@/app/cashflow', () => ({
  getRecurrenceText: jest.fn(() => 'Monthly'),
  CashFlowType: {
    INCOME: 'Income',
    EXPENSE: 'Expense',
  },
}));

jest.mock('@/app/components', () => ({
  DesktopListItemRow: ({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <tr>
      {children}
      <td>
        <button aria-label={editLabel} onClick={onEdit}>E</button>
        <button aria-label={deleteLabel} onClick={onDelete}>D</button>
      </td>
    </tr>
  ),
  DesktopListItemCell: ({ children, title, className }: { children: React.ReactNode; title?: string; className?: string }) => (
    <td title={title} className={className}>{children}</td>
  ),
  TruncatedBadge: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <span title={title}>{children}</span>
  ),
}));

describe('DesktopCashFlowEntryRow', () => {
  const baseEntry: CashFlowEntry = {
    id: '1',
    amount: 12345,
    date: '2025-01-15',
    description: 'Test description',
    categoryId: 'c1',
    category: { id: 'c1', name: 'Category A' } as unknown as Category,
    entryType: CashFlowType.INCOME,
  } as unknown as CashFlowEntry;

  const columnWidths = { date: '100px', amount: '100px', category: '100px', description: '100px', recurrence: '100px' };

  it('renders core fields and category badge when category exists', () => {
    render(<table><tbody><DesktopCashFlowEntryRow entry={baseEntry} onEdit={jest.fn()} onDelete={jest.fn()} columnWidths={columnWidths} /></tbody></table>);
    expect(screen.getByText('category a', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('does not render category badge when category is missing', () => {
    const noCat = { ...baseEntry, category: undefined } as CashFlowEntry;
    render(<table><tbody><DesktopCashFlowEntryRow entry={noCat} onEdit={jest.fn()} onDelete={jest.fn()} columnWidths={columnWidths} /></tbody></table>);
    expect(screen.queryByText('Category A')).not.toBeInTheDocument();
  });

  it('calls onEdit and onDelete handlers', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<table><tbody><DesktopCashFlowEntryRow entry={baseEntry} onEdit={onEdit} onDelete={onDelete} columnWidths={columnWidths} /></tbody></table>);

    fireEvent.click(screen.getByLabelText(editLabel));
    expect(onEdit).toHaveBeenCalledWith(baseEntry);

    fireEvent.click(screen.getByLabelText(deleteLabel));
    expect(onDelete).toHaveBeenCalledWith(baseEntry.id as unknown as number);
  });
});


