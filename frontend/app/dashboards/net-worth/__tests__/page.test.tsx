import React from 'react';
import { render, screen } from '@testing-library/react';
import { NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots';
import { NetWorthTrendGraph } from '@/app/dashboards/net-worth';

jest.mock('@/app/lib/api', () => ({
  getNetWorthTrendGraphForDateRange: jest.fn(),
  getNetWorthAvailableDateRange: jest.fn(),
}));

jest.mock('@/app/dashboards', () => ({
  DashboardPage: ({ children, itemName }: { children: (props: { trendGraphData: unknown }) => React.ReactElement; itemName: string }) => (
    <div data-testid="dashboard-page">
      <div data-testid="item-name">{itemName}</div>
      {children({ trendGraphData: mockTrendGraphData })}
    </div>
  ),
  TrendGraph: ({ title, labels, datasets }: { title: string; labels: string[]; datasets: unknown[] }) => (
    <div data-testid="trend-graph">
      <div data-testid="trend-graph-title">{title}</div>
      <div data-testid="trend-graph-labels">{labels.join(', ')}</div>
      <div data-testid="trend-graph-datasets">{datasets.length} datasets</div>
    </div>
  ),
}));

jest.mock('@/app/dashboards/net-worth', () => ({
  NetWorthTrendDatasets: jest.fn(() => [{ label: 'Net Worth', data: [10000, 12000] }]),
  NetWorthTotalDisplays: ({ netWorths }: { netWorths: number[] }) => (
    <div data-testid="net-worth-totals">
      <div data-testid="net-worths">{netWorths.join(', ')}</div>
    </div>
  ),
  NetWorthTrendGraphListTable: ({ netWorthTrendGraph }: { netWorthTrendGraph: unknown }) => (
    <div data-testid="trend-graph-table">
      {netWorthTrendGraph ? 'Table rendered' : 'No table'}
    </div>
  ),
  NetWorthTrendGraphData: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  DateRange: jest.fn(),
  formatDate: jest.fn((date: Date, noDay: boolean = false) => {
    if (!date) return undefined;
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const month = monthNames[date.getUTCMonth()];
    const day = noDay ? undefined : date.getUTCDate();
    const year = date.getUTCFullYear();
    
    if (day === undefined) {
      return `${month} ${year}`;
    }
    return `${month} ${day}, ${year}`;
  }),
}));

const mockTrendGraphData = {
  entries: [
    {
      date: '2024-01-01',
      netWorthInCents: 1000000
    },
    {
      date: '2024-01-02',
      netWorthInCents: 1200000
    }
  ]
};



describe('NetWorthTrendGraph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard page with correct item name', () => {
    render(<NetWorthTrendGraph />);
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    expect(screen.getByTestId('item-name')).toHaveTextContent(NET_WORTH_ITEM_NAME);
  });

  it('renders trend graph with correct data', () => {
    render(<NetWorthTrendGraph />);
    
    expect(screen.getByTestId('trend-graph')).toBeInTheDocument();
    expect(screen.getByTestId('trend-graph-title')).toHaveTextContent(NET_WORTH_ITEM_NAME);
    expect(screen.getByTestId('trend-graph-labels')).toHaveTextContent('January 1, 2024, January 2, 2024');
    expect(screen.getByTestId('trend-graph-datasets')).toHaveTextContent('1 datasets');
  });

  it('renders net worth totals with correct data', () => {
    render(<NetWorthTrendGraph />);
    
    expect(screen.getByTestId('net-worth-totals')).toBeInTheDocument();
    expect(screen.getByTestId('net-worths')).toHaveTextContent('1000000, 1200000');
  });

  it('renders trend graph table', () => {
    render(<NetWorthTrendGraph />);
    
    expect(screen.getByTestId('trend-graph-table')).toBeInTheDocument();
    expect(screen.getByText('Table rendered')).toBeInTheDocument();
  });

  it('handles null trend graph data gracefully', () => {
    const { rerender } = render(<NetWorthTrendGraph />);
    
    // Mock the DashboardPage to return null data
    jest.doMock('../components', () => ({
      DashboardPage: ({ children }: { children: (props: { trendGraphData: unknown }) => React.ReactElement }) => (
        <div data-testid="dashboard-page">
          {children({ trendGraphData: null })}
        </div>
      ),
      TrendGraph: jest.fn(),
    }));

    rerender(<NetWorthTrendGraph />);
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
}); 