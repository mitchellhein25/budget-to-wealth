import { render, screen } from '@testing-library/react';
import CashFlowEntriesList from './CashFlowEntriesList';

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

jest.mock('@/app/components/table/ListTable', () => ({
  ListTable: ({ title, items, isError, isLoading }: ListTableProps) => (
    <div data-testid={listTableTestId}>
      <div>{listTableText}</div>
      <div data-testid={titleTestId}>{title}</div>
      <div data-testid={itemsCountTestId}>{items?.length || 0}</div>
      <div data-testid={isErrorTestId}>{isError.toString()}</div>
      <div data-testid={isLoadingTestId}>{isLoading.toString()}</div>
    </div>
  ),
}));

describe('CashFlowEntriesList', () => {
  const mockProps = {
    entries: [],
    onEntryDeleted: jest.fn(),
    onEntryIsEditing: jest.fn(),
    isLoading: false,
    isError: false,
    cashFlowType: 'Cash Flow' as const,
  };

  it('renders with correct title', () => {
    render(<CashFlowEntriesList {...mockProps} />);
    expect(screen.getByTestId(titleTestId)).toHaveTextContent('Cash Flow Entries');
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