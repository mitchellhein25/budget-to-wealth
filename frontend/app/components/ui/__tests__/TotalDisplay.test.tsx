import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TotalDisplay } from '@/app/components';

jest.mock('@/app/lib/utils', () => ({
  convertCentsToDollars: jest.fn((cents) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(dollars);
  }),
  replaceSpacesWithDashes: jest.fn((text) => text.replace(/\s+/g, '-')),
}));

const defaultProps = {
  label: 'Total Income',
  amount: 250000,
};

describe('TotalDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with label and amount', () => {
    render(<TotalDisplay {...defaultProps} />);
    
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$2,500.00')).toBeInTheDocument();
  });

  it('displays different amounts correctly', () => {
    render(<TotalDisplay {...defaultProps} amount={100000} />);
    
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('displays zero amount correctly', () => {
    render(<TotalDisplay {...defaultProps} amount={0} />);
    
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<TotalDisplay {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.queryByText('$2,500.00')).not.toBeInTheDocument();
  });

  it('shows amount when isLoading is false', () => {
    render(<TotalDisplay {...defaultProps} isLoading={false} />);
    
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$2,500.00')).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('shows amount when isLoading is undefined', () => {
    render(<TotalDisplay {...defaultProps} />);
    
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$2,500.00')).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<TotalDisplay {...defaultProps} className="custom-class" />);
    
    const container = screen.getByText('Total Income').closest('.bg-base-200');
    expect(container).toHaveClass('custom-class');
  });

  it('handles different labels', () => {
    render(<TotalDisplay {...defaultProps} label="Total Expenses" />);
    
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('$2,500.00')).toBeInTheDocument();
  });

  it('handles negative amounts', () => {
    render(<TotalDisplay {...defaultProps} amount={-50000} />);
    
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('-$500.00')).toBeInTheDocument();
  });

  it('handles large amounts', () => {
    render(<TotalDisplay {...defaultProps} amount={100000000} />);
    
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000.00')).toBeInTheDocument();
  });

  it('applies compact styling when compact is true', () => {
    render(<TotalDisplay {...defaultProps} compact={true} />);
    
    const container = screen.getByText('Total Income').closest('.bg-base-200');
    expect(container).toHaveClass('p-1', 'sm:p-3');
    expect(container).toHaveClass('lg:min-w-[160px]');
    expect(screen.getByText('Total Income')).toHaveClass('text-xs', 'sm:text-sm');
    expect(screen.getByText('$2,500.00')).toHaveClass('text-lg', 'sm:text-xl');
  });

  it('applies non-compact styling when compact is false', () => {
    render(<TotalDisplay {...defaultProps} compact={false} />);
    
    const container = screen.getByText('Total Income').closest('.bg-base-200');
    expect(container).toHaveClass('p-2', 'sm:p-4');
    expect(container).toHaveClass('lg:min-w-[200px]');
    expect(screen.getByText('Total Income')).toHaveClass('text-sm', 'sm:text-base');
    expect(screen.getByText('$2,500.00')).toHaveClass('text-xl', 'sm:text-2xl');
  });

  it('applies non-compact styling when compact is undefined', () => {
    render(<TotalDisplay {...defaultProps} />);
    
    const container = screen.getByText('Total Income').closest('.bg-base-200');
    expect(container).toHaveClass('p-2', 'sm:p-4');
    expect(container).toHaveClass('lg:min-w-[200px]');
    expect(screen.getByText('Total Income')).toHaveClass('text-sm', 'sm:text-base');
    expect(screen.getByText('$2,500.00')).toHaveClass('text-xl', 'sm:text-2xl');
  });

  it('applies custom marginOverride when provided', () => {
    render(<TotalDisplay {...defaultProps} marginOverride="custom-margin" />);
    
    const container = screen.getByText('Total Income').closest('.bg-base-200');
    expect(container).toHaveClass('custom-margin');
  });

  it('applies default margin when marginOverride is not provided', () => {
    render(<TotalDisplay {...defaultProps} />);
    
    const container = screen.getByText('Total Income').closest('.bg-base-200');
    expect(container).toHaveClass('m-2', 'sm:m-0');
  });

  it('renders labelSuffix when provided', () => {
    const labelSuffix = <span data-testid="label-suffix">Suffix</span>;
    render(<TotalDisplay {...defaultProps} labelSuffix={labelSuffix} />);
    
    expect(screen.getByTestId('label-suffix')).toBeInTheDocument();
    expect(screen.getByText('Suffix')).toBeInTheDocument();
    const labelContainer = screen.getByText('Total Income').closest('div');
    expect(labelContainer).toHaveClass('flex', 'gap-1');
  });

  it('does not render labelSuffix when not provided', () => {
    render(<TotalDisplay {...defaultProps} />);
    
    expect(screen.queryByTestId('label-suffix')).not.toBeInTheDocument();
    const labelContainer = screen.getByText('Total Income').closest('div');
    expect(labelContainer).not.toHaveClass('flex', 'gap-1');
  });

  it('renders amountPrefix when provided', () => {
    const amountPrefix = <span data-testid="amount-prefix">$</span>;
    render(<TotalDisplay {...defaultProps} amountPrefix={amountPrefix} />);
    
    expect(screen.getByTestId('amount-prefix')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
    const valueContainer = screen.getByText('$2,500.00').closest('div');
    expect(valueContainer).toHaveClass('flex', 'gap-1');
  });

  it('does not render amountPrefix when not provided', () => {
    render(<TotalDisplay {...defaultProps} />);
    
    expect(screen.queryByTestId('amount-prefix')).not.toBeInTheDocument();
    const valueContainer = screen.getByText('$2,500.00').closest('div');
    expect(valueContainer).not.toHaveClass('flex', 'gap-1');
  });
}); 