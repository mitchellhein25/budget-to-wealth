import { render, screen, waitFor } from '@testing-library/react';
import NetWorthTrendGraph from './page';
import { NetWorthTrendGraphData } from './NetWorthTrendGraphData';

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

describe('NetWorthTrendGraph', () => {
  const mockNetWorthData: NetWorthTrendGraphData = {
    entries: [
      {
        date: '2024-01-01',
        assetValueInCents: 1000000,
        debtValueInCents: 300000,
        netWorthInCents: 700000,
      },
      {
        date: '2024-02-01',
        assetValueInCents: 1100000,
        debtValueInCents: 280000,
        netWorthInCents: 820000,
      },
    ],
  };

  beforeEach(() => {
    mockGetRequestSingle.mockClear();
    console.error = jest.fn();
  });

  it('renders the main page structure', () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockNetWorthData, successful: true });

    render(<NetWorthTrendGraph />);

    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockGetRequestSingle.mockImplementation(() => new Promise(() => {}));

    render(<NetWorthTrendGraph />);

    expect(screen.getByText('Loading Net Worth Dashboard...')).toBeInTheDocument();
  });

  it('shows error state when API call fails', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: null, successful: false });

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load Net Worth Dashboard.')).toBeInTheDocument();
    });
  });

  it('shows error state when API call throws error', async () => {
    mockGetRequestSingle.mockRejectedValue(new Error('Network error'));

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load Net Worth Dashboard.')).toBeInTheDocument();
    });
  });

  it('shows no data message when entries are empty', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: { entries: [] }, successful: true });

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('No data found. Add some assets and debts to see your net worth.')).toBeInTheDocument();
    });
  });

  it('shows no data message when entries are null', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: { entries: null }, successful: true });

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('No data found. Add some assets and debts to see your net worth.')).toBeInTheDocument();
    });
  });

  it('renders TrendGraph with correct data when successful', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockNetWorthData, successful: true });

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(screen.getByTestId('trend-graph')).toBeInTheDocument();
    });

    const trendGraph = screen.getByTestId('trend-graph');
    expect(trendGraph).toHaveAttribute('data-title', 'Net Worth');

    const labels = JSON.parse(trendGraph.getAttribute('data-labels') || '[]');
    expect(labels).toEqual(['December 31, 2023', 'January 31, 2024']);

    const datasets = JSON.parse(trendGraph.getAttribute('data-datasets') || '[]');
    expect(datasets).toHaveLength(3);

    const assetsDataset = datasets.find((d: any) => d.label === 'Assets');
    expect(assetsDataset).toEqual({
      type: 'line',
      label: 'Assets',
      data: [10000, 11000],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
    });

    const debtDataset = datasets.find((d: any) => d.label === 'Debt');
    expect(debtDataset).toEqual({
      type: 'line',
      label: 'Debt',
      data: [3000, 2800],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
    });

    const netWorthDataset = datasets.find((d: any) => d.label === 'Net Worth');
    expect(netWorthDataset).toEqual({
      type: 'line',
      label: 'Net Worth',
      data: [7000, 8200],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246)',
    });
  });

  it('calls API with correct date range', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockNetWorthData, successful: true });

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(mockGetRequestSingle).toHaveBeenCalledWith(
        expect.stringContaining('NetWorthTrendGraph?startDate=')
      );
    });
  });

  it('handles date range changes', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockNetWorthData, successful: true });

    render(<NetWorthTrendGraph />);

    const datePicker = screen.getByTestId('date-picker');
    const dateRange = JSON.parse(datePicker.getAttribute('data-date-range') || '{}');
    
    expect(dateRange).toHaveProperty('from');
    expect(dateRange).toHaveProperty('to');
  });
  
  it('logs error to console when API call fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetRequestSingle.mockRejectedValue(new Error('Network error'));

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching net worth dashboard:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
}); 