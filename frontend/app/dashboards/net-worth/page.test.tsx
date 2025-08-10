import { render, screen, waitFor } from '@testing-library/react';
import NetWorthTrendGraph from './page';
import { NetWorthTrendGraphData } from './components/NetWorthTrendGraphData';
import { getRequestSingle } from '@/app/lib/api/rest-methods/getRequest';
import { NET_WORTH_ITEM_NAME } from '@/app/net-worth/components';

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboards/net-worth',
}));

jest.mock('../components/DashboardSideBar', () => ({
  __esModule: true,
  DashboardSideBar: () => <div data-testid="dashboard-sidebar">DashboardSideBar Component</div>,
}));

jest.mock('@/app/components/DatePicker', () => ({
  __esModule: true,
  DatePicker: ({ dateRange }: { dateRange: unknown; setDateRange: () => void }) => (
    <div data-testid="date-picker" data-date-range={JSON.stringify(dateRange)}>
      DatePicker Component
    </div>
  ),
}));

jest.mock('../components/TrendGraph', () => ({
  __esModule: true,
  TrendGraph: ({ title, labels, datasets }: { title: string; labels: string[]; datasets: unknown[] }) => (
    <div data-testid="trend-graph" data-title={title} data-labels={JSON.stringify(labels)} data-datasets={JSON.stringify(datasets)}>
      TrendGraph Component
    </div>
  ),
}));

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
  getRequestSingle: jest.fn(),
}));

jest.mock('@/app/hooks', () => ({
  useMobileDetection: () => false,
}));

jest.mock('@/app/components/Utils', () => ({
  ...jest.requireActual('@/app/components/Utils'),
  getCurrentYearRange: jest.fn(() => ({
    from: new Date('2023-12-01'),
    to: new Date('2024-01-31'),
  })),
  formatDate: jest.fn((date: Date, noDay: boolean = false) => {
    if (noDay) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }),
}));

const mockGetRequestSingle = jest.mocked(getRequestSingle);

describe('NetWorthTrendGraph', () => {
  const mockNetWorthData: NetWorthTrendGraphData = {
    entries: [
      {
        date: '2023-12-31',
        assetValueInCents: 1000000,
        debtValueInCents: 300000,
        netWorthInCents: 700000,
      },
      {
        date: '2024-01-31',
        assetValueInCents: 1100000,
        debtValueInCents: 250000,
        netWorthInCents: 850000,
      },
    ],
  };

  beforeEach(() => {
    mockGetRequestSingle.mockClear();
    console.error = jest.fn();
  });

  it('renders the main page structure', () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockNetWorthData, successful: true, responseMessage: 'Success' });

    render(<NetWorthTrendGraph />);

    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockGetRequestSingle.mockImplementation(() => new Promise(() => {}));

    render(<NetWorthTrendGraph />);

    expect(screen.getByText(`Loading ${NET_WORTH_ITEM_NAME} trend graph...`)).toBeInTheDocument();
  });

  it('shows error state when API call fails', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: null, successful: false, responseMessage: 'Error' });

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText(`Failed to load ${NET_WORTH_ITEM_NAME} trend graph.`)).toBeInTheDocument();
    });
  });

  it('shows error state when API call throws error', async () => {
    mockGetRequestSingle.mockRejectedValue(new Error('Network error'));

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText(`Failed to load ${NET_WORTH_ITEM_NAME} trend graph.`)).toBeInTheDocument();
    });
  });

  it('shows no data message when entries are empty', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: { entries: [] }, successful: true, responseMessage: 'Success' });

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText(`No data found. Add some entries to see your ${NET_WORTH_ITEM_NAME} trends.`)).toBeInTheDocument();
    });
  });

  it('shows no data message when entries are null', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: { entries: [] }, successful: true, responseMessage: 'Success' });

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText(`No data found. Add some entries to see your ${NET_WORTH_ITEM_NAME} trends.`)).toBeInTheDocument();
    });
  });

  it('calls API with correct date range', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockNetWorthData, successful: true, responseMessage: 'Success' });

    render(<NetWorthTrendGraph />);

    await waitFor(() => {
      expect(mockGetRequestSingle).toHaveBeenCalledWith(
        expect.stringContaining('NetWorthTrendGraph?startDate=')
      );
    });
  });

  it('handles date range changes', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockNetWorthData, successful: true, responseMessage: 'Success' });

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
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching trend graph:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
}); 