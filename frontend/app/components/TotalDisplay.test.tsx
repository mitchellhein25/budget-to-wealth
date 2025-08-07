import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TotalDisplay } from './TotalDisplay';

jest.mock('@/app/components/Utils', () => ({
  convertCentsToDollars: jest.fn((cents) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(dollars);
  }),
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
}); 