import React from 'react';
import { render, screen } from '@testing-library/react';
import { NetWorthTrendGraphPage } from '@/app/dashboards/net-worth/page';
import { NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots';

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
  TrendGraph: jest.fn(({ title, labels, datasets }: { title: string; labels: string[]; datasets: unknown[] }) => (
    <div data-testid="trend-graph">
      <div data-testid="trend-graph-title">{title}</div>
      <div data-testid="trend-graph-labels">{labels.join(', ')}</div>
      <div data-testid="trend-graph-datasets">{datasets.length} datasets</div>
    </div>
  )),
}));

jest.mock('@/app/dashboards/net-worth', () => ({
  NetWorthTrendDatasets: jest.fn(() => [{ label: 'Net Worth', data: [10000, 12000] }]),
  NetWorthTotalDisplays: jest.fn(({ netWorths }: { netWorths: number[] }) => (
    <div data-testid="net-worth-totals">
      <div data-testid="net-worths">{netWorths.join(', ')}</div>
    </div>
  )),
  NetWorthTrendGraphListTable: jest.fn(({ netWorthTrendGraph }: { netWorthTrendGraph: unknown }) => (
    <div data-testid="trend-graph-table">
      {netWorthTrendGraph ? 'Table rendered' : 'No table'}
    </div>
  )),
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
      netWorthInCents: 1000000,
      assetValueInCents: 1000000,
      debtValueInCents: 1000000
    },
    {
      date: '2024-01-02',
      netWorthInCents: 1200000,
      assetValueInCents: 1200000,
      debtValueInCents: 1200000
    }
  ]
};



describe('NetWorthTrendGraph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard page with correct item name', () => {
    render(<NetWorthTrendGraphPage />);
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    expect(screen.getByTestId('item-name')).toHaveTextContent(NET_WORTH_ITEM_NAME);
  });

  it('renders all required components when data is available', () => {
    render(<NetWorthTrendGraphPage />);
    
    expect(screen.getByTestId('trend-graph')).toBeInTheDocument();
    expect(screen.getByTestId('net-worth-totals')).toBeInTheDocument();
    expect(screen.getByTestId('trend-graph-table')).toBeInTheDocument();
  });

}); 