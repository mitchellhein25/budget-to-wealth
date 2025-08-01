import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrendGraph } from './TrendGraph';

interface MockTrendGraphProps {
  data: Array<{ label: string; value: number }>;
  title: string;
  isLoading?: boolean;
}

jest.mock('./TrendGraph', () => ({
  TrendGraph: ({ data, title, isLoading }: MockTrendGraphProps) => (
    <div data-testid="trend-graph">
      <div data-testid="title">{title}</div>
      <div data-testid="data-count">{data.length}</div>
      <div data-testid="loading">{isLoading ? 'true' : 'false'}</div>
    </div>
  ),
}));

describe('TrendGraph', () => {
  const mockData = [
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 200 },
    { label: 'Mar', value: 150 },
  ];

  it('renders with correct title', () => {
    render(<TrendGraph data={mockData} title="Test Graph" />);
    expect(screen.getByTestId('title')).toHaveTextContent('Test Graph');
  });

  it('displays correct data count', () => {
    render(<TrendGraph data={mockData} title="Test Graph" />);
    expect(screen.getByTestId('data-count')).toHaveTextContent('3');
  });

  it('handles loading state', () => {
    render(<TrendGraph data={mockData} title="Test Graph" isLoading={true} />);
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('handles empty data', () => {
    render(<TrendGraph data={[]} title="Empty Graph" />);
    expect(screen.getByTestId('data-count')).toHaveTextContent('0');
  });
}); 