import { render, screen, act } from '@testing-library/react';
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

const mockMobileRow = (item: TestItem) => (
  <div key={item.id} data-testid="mobile-card">
    <span>{item.name}</span>
    <span>{item.value}</span>
  </div>
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

  beforeEach(() => {
    // Mock window.innerWidth for mobile testing
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop by default
    });
  });

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
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Get started by adding your first item.')).toBeInTheDocument();
  });

  it('renders mobile cards when on mobile and mobileRow is provided', async () => {
    // Set mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // Mobile width
    });

    render(<ListTable {...defaultProps} mobileRow={mockMobileRow} />);
    
    // Wait for client-side detection to complete
    await act(async () => {
      // Trigger a resize event to update mobile detection
      window.dispatchEvent(new Event('resize'));
    });
    
    // Should show mobile cards instead of table
    expect(screen.getAllByTestId('mobile-card')).toHaveLength(2);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders table when on mobile but no mobileRow is provided', async () => {
    // Set mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // Mobile width
    });

    render(<ListTable {...defaultProps} />);
    
    // Wait for client-side detection to complete
    await act(async () => {
      // Trigger a resize event to update mobile detection
      window.dispatchEvent(new Event('resize'));
    });
    
    // Should fall back to table view
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
}); 