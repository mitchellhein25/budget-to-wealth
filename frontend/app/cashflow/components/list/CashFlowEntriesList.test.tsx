import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CashFlowEntriesList from './CashFlowEntriesList';
import { CashFlowEntry, CashFlowType, EXPENSE_ITEM_NAME, INCOME_ITEM_NAME, RecurrenceFrequency } from '..';
import { deleteCashFlowEntry } from '@/app/lib/api/data-methods';

jest.mock('@/app/lib/api/data-methods', () => ({
  deleteCashFlowEntry: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  convertCentsToDollars: jest.fn((cents) => `$${(cents / 100).toFixed(2)}`),
}));

const mockDeleteCashFlowEntry = deleteCashFlowEntry as jest.MockedFunction<typeof deleteCashFlowEntry>;

const mockEntries: CashFlowEntry[] = [
  {
    id: 1,
    amount: 2500,
    entryType: "Income" as CashFlowType,
    categoryId: '1',
    category: { id: 1, name: 'Freelance', categoryType: "Income" as CashFlowType },
    date: '2024-01-17',
    description: 'One-time project',
    recurrenceFrequency: undefined,
    recurrenceEndDate: undefined,
  },
  {
    id: 2,
    amount: 5025,
    entryType: "Expense" as CashFlowType,
    categoryId: '2',
    category: { id: 2, name: 'Groceries', categoryType: "Expense" as CashFlowType },
    date: '2024-01-16',
    description: 'Weekly groceries',
    recurrenceFrequency: RecurrenceFrequency.Weekly,
    recurrenceEndDate: '2024-12-30',
  },
  {
    id: 3,
    amount: 7500,
    entryType: "Income" as CashFlowType,
    categoryId: '3',
    category: { id: 3, name: 'Salary', categoryType: "Income" as CashFlowType },
    date: '2024-01-15',
    description: 'Monthly salary',
    recurrenceFrequency: RecurrenceFrequency.Monthly,
    recurrenceEndDate: undefined,
  },
];

const defaultProps = {
  entries: mockEntries,
  cashFlowType: "Income" as CashFlowType,
  onEntryDeleted: jest.fn(),
  onEntryIsEditing: jest.fn(),
  isLoading: false,
  isError: false,
};

describe('CashFlowEntriesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
  });

  it('renders the component with correct title', () => {
    render(<CashFlowEntriesList {...defaultProps} />);
    
    expect(screen.getByText(`${INCOME_ITEM_NAME} Entries`)).toBeInTheDocument();
  });

  it('renders all entries with their basic information', () => {
    render(<CashFlowEntriesList {...defaultProps} />);
    
    expect(screen.getByText('Freelance')).toBeInTheDocument();
    expect(screen.getByText('One-time project')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Weekly groceries')).toBeInTheDocument();
    expect(screen.getByText('$50.25')).toBeInTheDocument();
    
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Monthly salary')).toBeInTheDocument();
    expect(screen.getByText('$75.00')).toBeInTheDocument();
  });

  it('shows recurrence information for recurring entries', () => {
    render(<CashFlowEntriesList {...defaultProps} />);
    
    const recurrenceCells = screen.getAllByText(/until/);
    expect(recurrenceCells).toHaveLength(1);
    expect(recurrenceCells[0]).toHaveTextContent('Weekly until');
    
    const monthlyCell = screen.getByText('Monthly');
    expect(monthlyCell).toBeInTheDocument();
  });

  it('renders edit and delete buttons for each entry', () => {
    render(<CashFlowEntriesList {...defaultProps} />);
    
    const editButtons = screen.getAllByLabelText('Edit');
    const deleteButtons = screen.getAllByLabelText('Delete');
    
    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('calls onEntryEdited when edit button is clicked', () => {
    render(<CashFlowEntriesList {...defaultProps} />);
    
    const editButtons = screen.getAllByLabelText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(defaultProps.onEntryIsEditing).toHaveBeenCalledWith(mockEntries[0]);
  });

  it('calls deleteCashFlowEntry when delete button is clicked and confirmed', async () => {
    mockDeleteCashFlowEntry.mockResolvedValue({ 
      data: null, 
      responseMessage: 'Entry deleted successfully', 
      successful: true 
    });
    
    render(<CashFlowEntriesList {...defaultProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockDeleteCashFlowEntry).toHaveBeenCalledWith(mockEntries[0].id);
    });
    
    expect(defaultProps.onEntryDeleted).toHaveBeenCalled();
  });

  it('does not call onEntryDeleted when delete fails', async () => {
    mockDeleteCashFlowEntry.mockResolvedValue({ 
      data: null, 
      responseMessage: 'Delete failed', 
      successful: false 
    });
    
    render(<CashFlowEntriesList {...defaultProps} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockDeleteCashFlowEntry).toHaveBeenCalled();
    });
    
    expect(defaultProps.onEntryDeleted).not.toHaveBeenCalled();
  });

  it('handles empty entries list', () => {
    render(<CashFlowEntriesList {...defaultProps} entries={[]} />);
    
    expect(screen.getByText(`${INCOME_ITEM_NAME} Entries`)).toBeInTheDocument();
    expect(screen.queryByLabelText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
  });

  it('handles entries without descriptions', () => {
    const entriesWithoutDescriptions = mockEntries.map(entry => ({
      ...entry,
      description: ''
    }));
    
    render(<CashFlowEntriesList {...defaultProps} entries={entriesWithoutDescriptions} />);
    
    expect(screen.getByText('Freelance')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('handles entries without categories', () => {
    const entriesWithoutCategories = mockEntries.map(entry => ({
      ...entry,
      category: undefined
    }));
    
    render(<CashFlowEntriesList {...defaultProps} entries={entriesWithoutCategories} />);
    
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByText('$50.25')).toBeInTheDocument();
    expect(screen.getByText('$75.00')).toBeInTheDocument();
  });
}); 