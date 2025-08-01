import { render, screen, waitFor } from '@testing-library/react';
import CashFlowTrendGraph from './page';
import { CashFlowTrendGraphData } from './CashFlowTrendGraphData';
import { getRequestSingle } from '@/app/lib/api/rest-methods/getRequest';

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboards/cashflow',
}));

jest.mock('../components/DashboardSideBar', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-sidebar">DashboardSideBar Component</div>,
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
  default: ({ title, labels, datasets }: { title: string; labels: string[]; datasets: unknown[] }) => (
    <div data-testid="trend-graph" data-title={title} data-labels={JSON.stringify(labels)} data-datasets={JSON.stringify(datasets)}>
      TrendGraph Component
    </div>
  ),
}));

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
  getRequestSingle: jest.fn(),
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

describe('CashFlowTrendGraph', () => {
  const mockCashFlowData: CashFlowTrendGraphData = {
    entries: [
      {
        date: '2023-12-01',
        incomeInCents: 500000,
        expensesInCents: 300000,
        netCashFlowInCents: 200000,
      },
      {
        date: '2024-01-01',
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
    mockGetRequestSingle.mockResolvedValue({ data: mockCashFlowData, successful: true, responseMessage: 'Success' });

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
    mockGetRequestSingle.mockResolvedValue({ data: null, successful: false, responseMessage: 'Error' });

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
    mockGetRequestSingle.mockResolvedValue({ data: { entries: [] }, successful: true, responseMessage: 'Success' });

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('No data found. Add some cash flow entries to see your cash flow trends.')).toBeInTheDocument();
    });
  });

  it('shows no data message when entries are null', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: { entries: null }, successful: true, responseMessage: 'Success' });

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(screen.getByText('No data found. Add some cash flow entries to see your cash flow trends.')).toBeInTheDocument();
    });
  });

  it('calls API with correct date range', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockCashFlowData, successful: true, responseMessage: 'Success' });

    render(<CashFlowTrendGraph />);

    await waitFor(() => {
      expect(mockGetRequestSingle).toHaveBeenCalledWith(
        expect.stringContaining('CashFlowTrendGraph?startDate=')
      );
    });
  });

  it('handles date range changes', async () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockCashFlowData, successful: true, responseMessage: 'Success' });

    render(<CashFlowTrendGraph />);

    const datePicker = screen.getByTestId('date-picker');
    const dateRange = JSON.parse(datePicker.getAttribute('data-date-range') || '{}');
    
    expect(dateRange).toHaveProperty('from');
    expect(dateRange).toHaveProperty('to');
  });

  it('renders content container with correct classes', () => {
    mockGetRequestSingle.mockResolvedValue({ data: mockCashFlowData, successful: true, responseMessage: 'Success' });

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