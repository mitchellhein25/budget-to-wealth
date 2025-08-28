import { render, screen, fireEvent } from '@testing-library/react';
import { MobileCashFlowEntryCard } from '../MobileCashFlowEntryCard';
import { CashFlowEntry, CashFlowType } from '../..';
import { Category } from '@/app/components/categories';
import { RecurrenceFrequency } from '../../components/RecurrenceFrequency';

const editLabel = 'Edit';
const deleteLabel = 'Delete';

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
  MobileListItemCardContent: ({ description, onEdit, onDelete }: { description: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <div data-testid="mobile-list-item-card-content">
      <div data-testid="description">{description}</div>
      <div data-testid="actions">
        <button aria-label={editLabel} onClick={onEdit}>E</button>
        <button aria-label={deleteLabel} onClick={onDelete}>D</button>
      </div>
    </div>
  ),
}));

describe('MobileCashFlowEntryCard', () => {
  const baseEntry: CashFlowEntry = {
    id: 1,
    amount: 12345,
    date: '2025-01-15',
    description: 'Test description',
    categoryId: 'c1',
    category: { id: 'c1', name: 'Category A' } as unknown as Category,
    entryType: 'Income' as CashFlowType,
  } as unknown as CashFlowEntry;

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the card with basic structure', () => {
    render(
      <MobileCashFlowEntryCard 
        entry={baseEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByTestId('mobile-list-item-card')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-list-item-card-header')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-list-item-card-content')).toBeInTheDocument();
  });

  it('renders date and amount in the header', () => {
    render(
      <MobileCashFlowEntryCard 
        entry={baseEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('2025-01-15')).toBeInTheDocument();
    expect(screen.getByText('$123.45')).toBeInTheDocument();
  });

  it('renders category badge when category exists', () => {
    render(
      <MobileCashFlowEntryCard 
        entry={baseEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('Category A')).toHaveClass('badge', 'badge-primary', 'badge-md');
  });

  it('does not render category badge when category is missing', () => {
    const noCategoryEntry = { ...baseEntry, category: undefined } as CashFlowEntry;
    
    render(
      <MobileCashFlowEntryCard 
        entry={noCategoryEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.queryByText('Category A')).not.toBeInTheDocument();
  });

  it('renders description in the content area', () => {
    render(
      <MobileCashFlowEntryCard 
        entry={baseEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    render(
      <MobileCashFlowEntryCard 
        entry={baseEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByLabelText(editLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(deleteLabel)).toBeInTheDocument();
  });

  it('calls onEdit with the entry when edit button is clicked', () => {
    render(
      <MobileCashFlowEntryCard 
        entry={baseEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    fireEvent.click(screen.getByLabelText(editLabel));
    expect(mockOnEdit).toHaveBeenCalledWith(baseEntry);
  });

  it('calls onDelete with the entry id when delete button is clicked', () => {
    render(
      <MobileCashFlowEntryCard 
        entry={baseEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    fireEvent.click(screen.getByLabelText(deleteLabel));
    expect(mockOnDelete).toHaveBeenCalledWith(baseEntry.id);
  });

  it('renders description with recurrence text when recurringOnly is true and entry has recurrence', () => {
    const recurringEntry: CashFlowEntry = {
      ...baseEntry,
      recurrenceFrequency: RecurrenceFrequency.MONTHLY,
      recurrenceEndDate: '2025-12-31',
    } as unknown as CashFlowEntry;

    render(
      <MobileCashFlowEntryCard 
        entry={recurringEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        recurringOnly={true}
      />
    );

    expect(screen.getByText(/Test description - Monthly until/)).toBeInTheDocument();
  });

  it('renders description with recurrence text when recurringOnly is true and entry has recurrence without end date', () => {
    const recurringEntry: CashFlowEntry = {
      ...baseEntry,
      recurrenceFrequency: RecurrenceFrequency.WEEKLY,
    } as unknown as CashFlowEntry;

    render(
      <MobileCashFlowEntryCard 
        entry={recurringEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        recurringOnly={true}
      />
    );

    expect(screen.getByText('Test description - Weekly')).toBeInTheDocument();
  });

  it('renders description with "Every 2 Weeks" text for Every2Weeks frequency', () => {
    const recurringEntry: CashFlowEntry = {
      ...baseEntry,
      recurrenceFrequency: RecurrenceFrequency.EVERY_2_WEEKS,
    } as unknown as CashFlowEntry;

    render(
      <MobileCashFlowEntryCard 
        entry={recurringEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        recurringOnly={true}
      />
    );

    expect(screen.getByText('Test description - Every 2 Weeks')).toBeInTheDocument();
  });

  it('renders description without recurrence text when recurringOnly is false', () => {
    const recurringEntry: CashFlowEntry = {
      ...baseEntry,
      recurrenceFrequency: RecurrenceFrequency.MONTHLY,
    } as unknown as CashFlowEntry;

    render(
      <MobileCashFlowEntryCard 
        entry={recurringEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        recurringOnly={false}
      />
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.queryByText('Test description - Monthly')).not.toBeInTheDocument();
  });

  it('renders description without recurrence text when recurringOnly is undefined', () => {
    const recurringEntry: CashFlowEntry = {
      ...baseEntry,
      recurrenceFrequency: RecurrenceFrequency.MONTHLY,
    } as unknown as CashFlowEntry;

    render(
      <MobileCashFlowEntryCard 
        entry={recurringEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.queryByText('Test description - Monthly')).not.toBeInTheDocument();
  });

  it('handles entry without description', () => {
    const noDescriptionEntry = { ...baseEntry, description: undefined } as CashFlowEntry;
    
    render(
      <MobileCashFlowEntryCard 
        entry={noDescriptionEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const descriptionElement = screen.getByTestId('description').querySelector('p');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass('text-sm', 'text-base-content', 'break-words');
  });

  it('handles entry without id', () => {
    const noIdEntry = { ...baseEntry, id: undefined } as CashFlowEntry;
    
    render(
      <MobileCashFlowEntryCard 
        entry={noIdEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    fireEvent.click(screen.getByLabelText(deleteLabel));
    expect(mockOnDelete).toHaveBeenCalledWith(undefined);
  });

  it('formats amount correctly for different values', () => {
    const highAmountEntry = { ...baseEntry, amount: 1000000 } as CashFlowEntry;
    
    render(
      <MobileCashFlowEntryCard 
        entry={highAmountEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('$10,000.00')).toBeInTheDocument();
  });

  it('formats amount correctly for zero', () => {
    const zeroAmountEntry = { ...baseEntry, amount: 0 } as CashFlowEntry;
    
    render(
      <MobileCashFlowEntryCard 
        entry={zeroAmountEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('formats amount correctly for negative values', () => {
    const negativeAmountEntry = { ...baseEntry, amount: -5000 } as CashFlowEntry;
    
    render(
      <MobileCashFlowEntryCard 
        entry={negativeAmountEntry} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('-$50.00')).toBeInTheDocument();
  });
});
