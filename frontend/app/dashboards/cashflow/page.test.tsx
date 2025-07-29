import { render, screen, waitFor } from '@testing-library/react';
import CashFlowTrendGraph from './page';
import { CashFlowTrendGraphData } from './CashFlowTrendGraphData';

jest.mock('../components/DashboardSideBar', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-sidebar">DashboardSideBar Component</div>,
}));

jest.mock('@/app/components/DatePicker', () => ({
  __esModule: true,
  default: ({ dateRange, setDateRange }: any) => (
    <div data-testid="date-picker" data-date-range={JSON.stringify(dateRange)}>
      DatePicker Component
    </div>
  ),
}));

jest.mock('../components/TrendGraph', () => ({
  __esModule: true,
  default: ({ title, labels, datasets }: any) => (
    <div data-testid="trend-graph" data-title={title} data-labels={JSON.stringify(labels)} data-datasets={JSON.stringify(datasets)}>
      TrendGraph Component
    </div>
  ),
}));

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
  getRequestSingle: jest.fn(),
}));

const mockGetRequestSingle = require('@/app/lib/api/rest-methods/getRequest').getRequestSingle as jest.MockedFunction<() => Promise<any>>;

describe('CashFlowTrendGraph', () => {
  const mockCashFlowData: CashFlowTrendGraphData = {
    entries: [
      {
        date: '2024-01-01',
        incomeInCents: 500000,
        expensesInCents: 300000,
        netCashFlowInCents: 200000,
      },
      {
        date: '2024-02-01',
        incomeInCents: 600000,
        expensesInCents: 350000,
        netCashFlowInCents: 250000,
      },
    ],
  };

  beforeEach(() => {
    mockGetRequestSingle.mockClear();
    console.error = jest.fn();
  });

  it('renders the main page structure', () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockCashFlowData, successful: true });

    render(<CashFlowTrendGraph />);

    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockGetRequestSingle.mockImplementation(() => new Promise(() => {}));

    render(<CashFlowTrendGraph />);

    expect(screen.getByText('Loading CashFlow Trend Graph...')).toBeInTheDocument();
  });

  it('shows error state when API call fails', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: null, successful: false });

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load CashFlow Trend Graph.')).toBeInTheDocument();
    });
  });

  it('shows error state when API call throws error', async () => {
    mockGetRequestSingle.mockRejectedValue(new Error('Network error'));

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load CashFlow Trend Graph.')).toBeInTheDocument();
    });
  });

  it('shows no data message when entries are empty', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: { entries: [] }, successful: true });

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('No data found. Add some cash flow entries to see your cash flow trends.')).toBeInTheDocument();
    });
  });

  it('shows no data message when entries are null', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: { entries: null }, successful: true });

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('No data found. Add some cash flow entries to see your cash flow trends.')).toBeInTheDocument();
    });
  });

  it('renders TrendGraph with correct data when successful', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockCashFlowData, successful: true });

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(screen.getByTestId('trend-graph')).toBeInTheDocument();
    });

    const trendGraph = screen.getByTestId('trend-graph');
    expect(trendGraph).toHaveAttribute('data-title', 'CashFlow');

    const labels = JSON.parse(trendGraph.getAttribute('data-labels') || '[]');
    expect(labels).toEqual(['December 2023', 'January 2024']);

    const datasets = JSON.parse(trendGraph.getAttribute('data-datasets') || '[]');
    expect(datasets).toHaveLength(3);

    const incomeDataset = datasets.find((d: any) => d.label === 'Income');
    expect(incomeDataset).toEqual({
      type: 'bar',
      label: 'Income',
      data: [5000, 6000],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
    });

    const expensesDataset = datasets.find((d: any) => d.label === 'Expenses');
    expect(expensesDataset).toEqual({
      type: 'bar',
      label: 'Expenses',
      data: [3000, 3500],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
    });

    const netCashFlowDataset = datasets.find((d: any) => d.label === 'Net Cash Flow');
    expect(netCashFlowDataset).toEqual({
      type: 'line',
      label: 'Net Cash Flow',
      data: [2000, 2500],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    });
  });

  it('calls API with correct date range', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockCashFlowData, successful: true });

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(mockGetRequestSingle).toHaveBeenCalledWith(
        expect.stringContaining('CashFlowTrendGraph?startDate=')
      );
    });
  });

  it('handles date range changes', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockCashFlowData, successful: true });

    render(<CashFlowTrendGraph />);

    const datePicker = screen.getByTestId('date-picker');
    const dateRange = JSON.parse(datePicker.getAttribute('data-date-range') || '{}');
    
    expect(dateRange).toHaveProperty('from');
    expect(dateRange).toHaveProperty('to');
  });

  it('renders content container with correct classes', () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockCashFlowData, successful: true });

    render(<CashFlowTrendGraph />);

    const contentContainer = screen.getByTestId('date-picker').closest('.flex-1');
    expect(contentContainer).toHaveClass('flex-1', 'flex', 'flex-col', 'gap-2');
  });

  it('logs error to console when API call fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetRequestSingle.mockRejectedValue(new Error('Network error'));

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching net worth dashboard:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
}); 