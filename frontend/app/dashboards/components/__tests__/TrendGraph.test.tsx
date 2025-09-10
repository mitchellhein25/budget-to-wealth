import { render, screen } from '@testing-library/react';
import { useMobileDetection, MobileState } from '@/app/hooks';
import { TrendGraph } from '@/app/dashboards';

const titleText = 'Test Trend Graph';
const lineDatasetLabel = 'Line Dataset';
const barDatasetLabel = 'Bar Dataset';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock chart dimensions to prevent zero width/height warnings
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 800,
});
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 400,
});
Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  configurable: true,
  value: () => ({
    width: 800,
    height: 400,
    top: 0,
    left: 0,
    right: 800,
    bottom: 400,
  }),
});

jest.mock('@/app/hooks', () => ({
  useMobileDetection: jest.fn(),
  MobileState: {
    XSMALL: 'xsmall',
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    XLARGE: 'xlarge',
    XXLARGE: 'xxlarge',
  }
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
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={mockDatasets}
        height={100}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('renders chart with responsive height', () => {
    mockUseMobileDetection.mockReturnValue(MobileState.SMALL);
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={mockDatasets}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('renders chart with mixed line and bar datasets', () => {
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    
    render(
      <TrendGraph
        title={titleText}
        labels={mockLabels}
        datasets={mockDatasets}
      />
    );
    
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });
});
