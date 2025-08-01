import { render, screen } from '@testing-library/react';
import { ListTable } from '../ListTable';

interface TestItem {
  id: number;
  name: string;
  value: number;
}

const mockItems: TestItem[] = [
  { id: 1, name: 'Item 1', value: 100 },
  { id: 2, name: 'Item 2', value: 200 },
];

const mockHeaderRow = (
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Value</th>
  </tr>
);

const mockBodyRow = (item: TestItem) => (
  <tr key={item.id}>
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.value}</td>
  </tr>
);

describe('ListTable', () => {
  const defaultProps = {
    title: 'Test Table',
    headerRow: mockHeaderRow,
    bodyRow: mockBodyRow,
    items: mockItems,
    isError: false,
    isLoading: false,
  };

  it('renders table with title', () => {
    render(<ListTable {...defaultProps} />);
    expect(screen.getByText('Test Table')).toBeInTheDocument();
  });

  it('renders header row', () => {
    render(<ListTable {...defaultProps} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('renders body rows for each item', () => {
    render(<ListTable {...defaultProps} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ListTable {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<ListTable {...defaultProps} isError={true} />);
    expect(screen.getByText('Failed to load data. Please try again.')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(<ListTable {...defaultProps} items={[]} />);
    expect(screen.getByText('Test Table')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });
}); 