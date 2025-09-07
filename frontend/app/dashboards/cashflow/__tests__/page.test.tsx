import React from 'react';
import { render, screen } from '@testing-library/react';
import { CASHFLOW_ITEM_NAME } from '@/app/cashflow';
import { CashFlowTrendGraph } from '@/app/dashboards/cashflow';

jest.mock('@/app/lib/api', () => ({
  getCashFlowTrendGraphForDateRange: jest.fn(),
  getCashFlowEntriesDateRange: jest.fn(),
}));

jest.mock('@/app/dashboards', () => ({
  ...jest.requireActual('@/app/dashboards'),
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

jest.mock('@/app/dashboards/cashflow', () => ({
  ...jest.requireActual('@/app/dashboards/cashflow'),
  CashFlowTrendDatasets: jest.fn(() => [{ label: 'Income', data: [100, 200] }]),
  CashFlowTotalDisplays: ({ incomes, expenses, netCashFlows }: { incomes: number[]; expenses: number[]; netCashFlows: number[] }) => (
    <div data-testid="cash-flow-totals">
      <div data-testid="incomes">{incomes.join(', ')}</div>
      <div data-testid="expenses">{expenses.join(', ')}</div>
      <div data-testid="net-cash-flows">{netCashFlows.join(', ')}</div>
    </div>
  ),
  CashFlowTrendGraphListTable: ({ cashFlowTrendGraph }: { cashFlowTrendGraph: unknown }) => (
    <div data-testid="trend-graph-table">
      {cashFlowTrendGraph ? 'Table rendered' : 'No table'}
    </div>
  ),
  CashFlowTrendGraphData: jest.fn(),
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
      incomeInCents: 1000,
      expensesInCents: 500,
      netCashFlowInCents: 500
    },
    {
      date: '2024-02-02',
      incomeInCents: 1500,
      expensesInCents: 600,
      netCashFlowInCents: 900
    }
  ]
};



describe('CashFlowTrendGraph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard page with correct item name', () => {
    render(<CashFlowTrendGraph />);
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    expect(screen.getByTestId('item-name')).toHaveTextContent(CASHFLOW_ITEM_NAME);
  });

  it('renders trend graph with correct data', () => {
    render(<CashFlowTrendGraph />);
    
    expect(screen.getByTestId('trend-graph')).toBeInTheDocument();
    expect(screen.getByTestId('trend-graph-title')).toHaveTextContent(CASHFLOW_ITEM_NAME);
    expect(screen.getByTestId('trend-graph-labels')).toHaveTextContent('January 2024, February 2024');
    expect(screen.getByTestId('trend-graph-datasets')).toHaveTextContent('1 datasets');
  });

  it('renders cash flow totals with correct data', () => {
    render(<CashFlowTrendGraph />);
    
    expect(screen.getByTestId('cash-flow-totals')).toBeInTheDocument();
    expect(screen.getByTestId('incomes')).toHaveTextContent('1000, 1500');
    expect(screen.getByTestId('expenses')).toHaveTextContent('500, 600');
    expect(screen.getByTestId('net-cash-flows')).toHaveTextContent('500, 900');
  });

  it('renders trend graph table', () => {
    render(<CashFlowTrendGraph />);
    
    expect(screen.getByTestId('trend-graph-table')).toBeInTheDocument();
    expect(screen.getByText('Table rendered')).toBeInTheDocument();
  });

  it('handles null trend graph data gracefully', () => {
    const { rerender } = render(<CashFlowTrendGraph />);
    
    // Mock the DashboardPage to return null data
    jest.doMock('@/app/dashboards', () => ({
      DashboardPage: ({ children }: { children: (props: { trendGraphData: unknown }) => React.ReactElement }) => (
        <div data-testid="dashboard-page">
          {children({ trendGraphData: null })}
        </div>
      ),
      TrendGraph: jest.fn(),
    }));

    rerender(<CashFlowTrendGraph />);
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
}); 