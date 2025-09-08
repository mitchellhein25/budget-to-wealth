import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MobileState, useMobileDetection, useSidebarDetection } from '@/app/hooks';
import { TrendGraphData, TrendGraphEntry } from '@/app/dashboards';
import { DashboardPage } from '@/app/dashboards/components/DashboardPage';

// Mock console.error to prevent it from appearing in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

jest.mock('@/app/hooks', () => ({
  useMobileDetection: jest.fn(),
  MobileState: { },
  useSidebarDetection: jest.fn(() => true),
}));

jest.mock('@/app/components', () => ({
  DatePicker: ({ setDateRange }: { setDateRange: (range: { from: Date; to: Date }) => void }) => (
    <div data-testid="date-picker">
      <button onClick={() => setDateRange({ from: new Date('2024-01-01'), to: new Date('2024-01-31') })}>
        Change Date
      </button>
    </div>
  ),
}));

jest.mock('@/app/dashboards', () => ({
  DashboardSideBar: () => <div data-testid="dashboard-sidebar">Sidebar</div>,
  HistoryToggle: ({ onToggle }: { onToggle: (checked: boolean) => void }) => (
    <button onClick={() => onToggle(true)} data-testid="history-toggle">
      Toggle History
    </button>
  ),
  getCompletedMonthsDefaultRange: () => ({ from: new Date('2024-01-01'), to: new Date('2024-01-31') }),
}));

const mockUseMobileDetection = useMobileDetection as jest.MockedFunction<typeof useMobileDetection>;
const mockUseSidebarDetection = useSidebarDetection as jest.MockedFunction<typeof useSidebarDetection>;

describe('DashboardPage', () => {
  const mockGetAvailableDateRange = jest.fn();
  const mockGetTrendGraph = jest.fn();
  const mockChildren = jest.fn(({ trendGraphData }) => (
    <div data-testid="trend-graph-content">
      {trendGraphData ? 'Data loaded' : 'No data'}
    </div>
  ));

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    
    // Set up default mocks to prevent undefined response errors
    mockGetTrendGraph.mockResolvedValue({
      successful: true,
      data: { entries: [] } as TrendGraphData<TrendGraphEntry>,
    });
    mockGetAvailableDateRange.mockResolvedValue({
      successful: true,
      data: { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') },
    });
  });

  it('renders dashboard with sidebar on desktop', () => {
    render(
      <DashboardPage
        getAvailableDateRange={mockGetAvailableDateRange}
        getTrendGraph={mockGetTrendGraph}
        itemName="Test Item"
      >
        {mockChildren}
      </DashboardPage>
    );

    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('history-toggle')).toBeInTheDocument();
  });

  it('hides sidebar on mobile', () => {
    mockUseMobileDetection.mockReturnValue(MobileState.SMALL);
    mockUseSidebarDetection.mockReturnValue(false);
    render(
      <DashboardPage
        getAvailableDateRange={mockGetAvailableDateRange}
        getTrendGraph={mockGetTrendGraph}
        itemName="Test Item"
      >
        {mockChildren}
      </DashboardPage>
    );

    expect(screen.queryByTestId('dashboard-sidebar')).not.toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockGetTrendGraph.mockImplementation(() => new Promise(() => {}));

    render(
      <DashboardPage
        getAvailableDateRange={mockGetAvailableDateRange}
        getTrendGraph={mockGetTrendGraph}
        itemName="Test Item"
      >
        {mockChildren}
      </DashboardPage>
    );

    expect(screen.getByText('Loading Test Item trend graph...')).toBeInTheDocument();
  });

  it('shows error state when API call fails', async () => {
    mockGetTrendGraph.mockRejectedValue(new Error('API Error'));

    render(
      <DashboardPage
        getAvailableDateRange={mockGetAvailableDateRange}
        getTrendGraph={mockGetTrendGraph}
        itemName="Test Item"
      >
        {mockChildren}
      </DashboardPage>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load Test Item trend graph.')).toBeInTheDocument();
    });
  });

  it('shows error state when API call returns unsuccessful response', async () => {
    mockGetTrendGraph.mockResolvedValue({
      successful: false,
      data: null,
    });

    render(
      <DashboardPage
        getAvailableDateRange={mockGetAvailableDateRange}
        getTrendGraph={mockGetTrendGraph}
        itemName="Test Item"
      >
        {mockChildren}
      </DashboardPage>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load Test Item trend graph.')).toBeInTheDocument();
    });
  });

  it('shows empty state when no data is returned', async () => {
    mockGetTrendGraph.mockResolvedValue({
      successful: true,
      data: { entries: [] } as TrendGraphData<TrendGraphEntry>,
    });

    render(
      <DashboardPage
        getAvailableDateRange={mockGetAvailableDateRange}
        getTrendGraph={mockGetTrendGraph}
        itemName="Test Item"
      >
        {mockChildren}
      </DashboardPage>
    );

    await waitFor(() => {
      expect(screen.getByText('No data found. Add some entries to see your Test Item trends.')).toBeInTheDocument();
    });
  });

  it('shows content when data is loaded successfully', async () => {
    const mockData = { entries: [{ date: '2024-01-01' }] } as TrendGraphData<TrendGraphEntry>;
    mockGetTrendGraph.mockResolvedValue({
      successful: true,
      data: mockData,
    });

    render(
      <DashboardPage
        getAvailableDateRange={mockGetAvailableDateRange}
        getTrendGraph={mockGetTrendGraph}
        itemName="Test Item"
      >
        {mockChildren}
      </DashboardPage>
    );

    await waitFor(() => {
      expect(screen.getByTestId('trend-graph-content')).toBeInTheDocument();
      expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });
  });

  it('handles history toggle to show all data', async () => {
    mockGetAvailableDateRange.mockResolvedValue({
      successful: true,
      data: { startDate: '2020-01-01', endDate: '2024-12-31' },
    });

    render(
      <DashboardPage
        getAvailableDateRange={mockGetAvailableDateRange}
        getTrendGraph={mockGetTrendGraph}
        itemName="Test Item"
      >
        {mockChildren}
      </DashboardPage>
    );

    fireEvent.click(screen.getByTestId('history-toggle'));

    await waitFor(() => {
      expect(mockGetAvailableDateRange).toHaveBeenCalled();
    });
  });

  it('handles history toggle failure gracefully', async () => {
    mockGetAvailableDateRange.mockResolvedValue({
      successful: false,
      data: null,
    });

    render(
      <DashboardPage
        getAvailableDateRange={mockGetAvailableDateRange}
        getTrendGraph={mockGetTrendGraph}
        itemName="Test Item"
      >
        {mockChildren}
      </DashboardPage>
    );

    fireEvent.click(screen.getByTestId('history-toggle'));

    await waitFor(() => {
      expect(mockGetAvailableDateRange).toHaveBeenCalled();
    });
  });
});
