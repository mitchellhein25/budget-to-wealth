import { render, screen } from '@testing-library/react';
import { CashFlowType } from '@/app/cashflow';
import { CashFlowEntriesList } from '@/app/cashflow/components/list/CashFlowEntriesList';

const listTableTestId = 'list-table';
const listTableText = 'ListTable';
const titleTestId = 'title';
const itemsCountTestId = 'items-count';
const isErrorTestId = 'is-error';
const isLoadingTestId = 'is-loading';

interface ListTableProps {
  title: string;
  items: unknown[];
  isError: boolean;
  isLoading: boolean;
}

jest.mock('@/app/hooks', () => ({
  useDeleteConfirmation: jest.fn(() => ({
    isModalOpen: false,
    isLoading: false,
    openDeleteModal: jest.fn(),
    closeDeleteModal: jest.fn(),
    confirmDelete: jest.fn(),
  })),
}));

jest.mock('@/app/components', () => ({
  ...jest.requireActual('@/app/components'),
  ListTable: ({ title, items, isError, isLoading }: ListTableProps) => (
    <div data-testid={listTableTestId}>
      <div>{listTableText}</div>
      <div data-testid={titleTestId}>{title}</div>
      <div data-testid={itemsCountTestId}>{items?.length || 0}</div>
      <div data-testid={isErrorTestId}>{isError.toString()}</div>
      <div data-testid={isLoadingTestId}>{isLoading.toString()}</div>
    </div>
  ),
  DeleteConfirmationModal: jest.fn(() => null),
}));

jest.mock('@/app/cashflow', () => ({
  RecurrenceFrequency: {  },
  CashFlowType: { 
    INCOME: 'Income',
    EXPENSE: 'Expense'
   },
}));

describe('CashFlowEntriesList', () => {
  const mockProps = {
    entries: [],
    onEntryDeleted: jest.fn(),
    onEntryIsEditing: jest.fn(),
    isLoading: false,
    isError: false,
    cashFlowType: CashFlowType.INCOME,
  };

  it('renders with correct title', () => {
    render(<CashFlowEntriesList {...mockProps} />);
    expect(screen.getByTestId(titleTestId)).toHaveTextContent(`${CashFlowType.INCOME} Entries`);
  });

  it('passes correct props to ListTable', () => {
    render(<CashFlowEntriesList {...mockProps} />);
    expect(screen.getByTestId(listTableTestId)).toBeInTheDocument();
    expect(screen.getByTestId(itemsCountTestId)).toHaveTextContent('0');
    expect(screen.getByTestId(isErrorTestId)).toHaveTextContent('false');
    expect(screen.getByTestId(isLoadingTestId)).toHaveTextContent('false');
  });

  it('handles loading state', () => {
    render(<CashFlowEntriesList {...mockProps} isLoading={true} />);
    expect(screen.getByTestId(isLoadingTestId)).toHaveTextContent('true');
  });

  it('handles error state', () => {
    render(<CashFlowEntriesList {...mockProps} isError={true} />);
    expect(screen.getByTestId(isErrorTestId)).toHaveTextContent('true');
  });
});    