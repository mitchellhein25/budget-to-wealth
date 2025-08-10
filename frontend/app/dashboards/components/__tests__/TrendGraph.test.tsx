import { render, screen } from '@testing-library/react';
import { TrendGraph } from '../TrendGraph';
import { useMobileDetection } from '@/app/hooks';

const titleText = 'Test Trend Graph';
const lineDatasetLabel = 'Line Dataset';
const barDatasetLabel = 'Bar Dataset';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('@/app/hooks', () => ({
  useMobileDetection: jest.fn(),
}));

const mockUseMobileDetection = useMobileDetection as jest.MockedFunction<typeof useMobileDetection>;

describe('TrendGraph', () => {
  const mockLabels = ['Jan', 'Feb', 'Mar', 'Apr'];
  const mockDatasets = [
    {
      type: 'line' as const,
      label: lineDatasetLabel,
      data: [10, 20, 15, 25],
      borderColor: '#FF0000',
      backgroundColor: '#FF0000',
    },
    {
      type: 'bar' as const,
      label: barDatasetLabel,
      data: [5, 15, 10, 20],
      borderColor: '#00FF00',
      backgroundColor: '#00FF00',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with title and datasets', () => {
    mockUseMobileDetection.mockReturnValue(false);
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={mockDatasets}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('uses mobile height when on mobile device', () => {
    mockUseMobileDetection.mockReturnValue(true);
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={mockDatasets}
      />
    );
    
    const chartContainer = screen.getByText(titleText).closest('div')?.nextElementSibling;
    expect(chartContainer).toHaveStyle({ height: '240px' });
  });

  it('uses desktop height when not on mobile device', () => {
    mockUseMobileDetection.mockReturnValue(false);
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={mockDatasets}
      />
    );
    
    const chartContainer = screen.getByText(titleText).closest('div')?.nextElementSibling;
    expect(chartContainer).toHaveStyle({ height: '420px' });
  });

  it('handles datasets with missing data values', () => {
    mockUseMobileDetection.mockReturnValue(false);
    
    const datasetsWithMissingData = [
      {
        type: 'line' as const,
        label: lineDatasetLabel,
        data: [10, 15, 25],
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
      },
    ];
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={datasetsWithMissingData}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('renders line chart for line type datasets', () => {
    mockUseMobileDetection.mockReturnValue(false);
    
    const lineOnlyDatasets = [
      {
        type: 'line' as const,
        label: lineDatasetLabel,
        data: [10, 20, 15, 25],
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
      },
    ];
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={lineOnlyDatasets}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('renders bar chart for bar type datasets', () => {
    mockUseMobileDetection.mockReturnValue(false);
    
    const barOnlyDatasets = [
      {
        type: 'bar' as const,
        label: barDatasetLabel,
        data: [5, 15, 10, 20],
        borderColor: '#00FF00',
        backgroundColor: '#00FF00',
      },
    ];
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={barOnlyDatasets}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('renders mixed line and bar charts', () => {
    mockUseMobileDetection.mockReturnValue(false);
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={mockDatasets}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('handles empty datasets array', () => {
    mockUseMobileDetection.mockReturnValue(false);
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={[]}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('handles empty labels array', () => {
    mockUseMobileDetection.mockReturnValue(false);
    
    render(
      <TrendGraph
        title={titleText}
        labels={[]}
        datasets={mockDatasets}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });
});
