import { render, screen } from '@testing-library/react';
import TrendGraph, { TrendGraphProps, TrendGraphDataset } from './TrendGraph';

jest.mock('react-chartjs-2', () => ({
  Chart: ({ title, type, options, data }: any) => (
    <div data-testid="chart" data-title={title} data-type={type} data-options={JSON.stringify(options)} data-data={JSON.stringify(data)}>
      Chart Component
    </div>
  ),
}));

describe('TrendGraph', () => {
  const mockProps: TrendGraphProps = {
    title: 'Test Chart',
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        type: 'line',
        label: 'Test Line',
        data: [10, 20, 30],
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
      },
      {
        type: 'bar',
        label: 'Test Bar',
        data: [15, 25, 35],
        borderColor: 'rgb(0, 255, 0)',
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
      },
    ],
  };

  it('renders the TrendGraph component', () => {
    render(<TrendGraph {...mockProps} />);

    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('renders with correct text', () => {
    render(<TrendGraph {...mockProps} />);

    expect(screen.getByText('Chart Component')).toBeInTheDocument();
  });

  it('passes correct title to Chart component', () => {
    render(<TrendGraph {...mockProps} />);

    const chart = screen.getByTestId('chart');
    expect(chart).toHaveAttribute('data-title', 'Test Chart');
  });

  it('passes correct chart type to Chart component', () => {
    render(<TrendGraph {...mockProps} />);

    const chart = screen.getByTestId('chart');
    expect(chart).toHaveAttribute('data-type', 'line');
  });

  it('passes correct options to Chart component', () => {
    render(<TrendGraph {...mockProps} />);

    const chart = screen.getByTestId('chart');
    const options = JSON.parse(chart.getAttribute('data-options') || '{}');

    expect(options.responsive).toBe(true);
    expect(options.maintainAspectRatio).toBe(false);
    expect(options.plugins.legend.position).toBe('top');
    expect(options.plugins.title.display).toBe(true);
    expect(options.plugins.title.text).toBe('Test Chart');
  });

  it('passes correct data to Chart component', () => {
    render(<TrendGraph {...mockProps} />);

    const chart = screen.getByTestId('chart');
    const data = JSON.parse(chart.getAttribute('data-data') || '{}');

    expect(data.labels).toEqual(['Jan', 'Feb', 'Mar']);
    expect(data.datasets).toHaveLength(2);
    expect(data.datasets[0]).toEqual({
      type: 'line',
      label: 'Test Line',
      data: [10, 20, 30],
      borderColor: 'rgb(255, 0, 0)',
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
    });
    expect(data.datasets[1]).toEqual({
      type: 'bar',
      label: 'Test Bar',
      data: [15, 25, 35],
      borderColor: 'rgb(0, 255, 0)',
      backgroundColor: 'rgba(0, 255, 0, 0.5)',
    });
  });

  it('handles empty datasets', () => {
    const emptyProps: TrendGraphProps = {
      title: 'Empty Chart',
      labels: [],
      datasets: [],
    };

    render(<TrendGraph {...emptyProps} />);

    const chart = screen.getByTestId('chart');
    const data = JSON.parse(chart.getAttribute('data-data') || '{}');

    expect(data.labels).toEqual([]);
    expect(data.datasets).toEqual([]);
  });

  it('handles single dataset', () => {
    const singleDatasetProps: TrendGraphProps = {
      title: 'Single Dataset',
      labels: ['Jan', 'Feb'],
      datasets: [
        {
          type: 'line',
          label: 'Single Line',
          data: [10, 20],
          borderColor: 'rgb(0, 0, 255)',
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        },
      ],
    };

    render(<TrendGraph {...singleDatasetProps} />);

    const chart = screen.getByTestId('chart');
    const data = JSON.parse(chart.getAttribute('data-data') || '{}');

    expect(data.datasets).toHaveLength(1);
    expect(data.datasets[0].label).toBe('Single Line');
  });

  it('handles mixed chart types', () => {
    const mixedProps: TrendGraphProps = {
      title: 'Mixed Chart',
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        {
          type: 'line',
          label: 'Line Data',
          data: [10, 20, 30],
          borderColor: 'rgb(255, 0, 0)',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
        },
        {
          type: 'bar',
          label: 'Bar Data',
          data: [15, 25, 35],
          borderColor: 'rgb(0, 255, 0)',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
        },
      ],
    };

    render(<TrendGraph {...mixedProps} />);

    const chart = screen.getByTestId('chart');
    const data = JSON.parse(chart.getAttribute('data-data') || '{}');

    expect(data.datasets[0].type).toBe('line');
    expect(data.datasets[1].type).toBe('bar');
  });
}); 