import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DatePicker } from './DatePicker';

jest.mock('./Utils', () => ({
  convertDateToISOString: jest.fn((date) => date?.toISOString().slice(0, 10) ?? ''),
}));

const mockSetDateRange = jest.fn();

const defaultProps = {
  dateRange: { from: undefined, to: undefined },
  setDateRange: mockSetDateRange,
};

describe('DatePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with title and inputs', () => {
    render(<DatePicker {...defaultProps} />);
    
    expect(screen.getByText('Date Range Filter')).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByText('Apply Filter')).toBeInTheDocument();
  });

  it('renders date inputs with correct attributes', () => {
    render(<DatePicker {...defaultProps} />);
    
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    expect(inputs).toHaveLength(2);
    
    inputs.forEach(input => {
      expect(input).toHaveAttribute('type', 'date');
    });
  });

  it('updates input values when user types', () => {
    render(<DatePicker {...defaultProps} />);
    
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    const fromInput = inputs[0];
    const toInput = inputs[1];
    
    fireEvent.change(fromInput, { target: { value: '2024-01-15' } });
    fireEvent.change(toInput, { target: { value: '2024-01-31' } });
    
    expect(fromInput).toHaveValue('2024-01-15');
    expect(toInput).toHaveValue('2024-01-31');
  });

  it('enables apply button when dates are changed', () => {
    render(<DatePicker {...defaultProps} />);
    
    const applyButton = screen.getByText('Apply Filter');
    expect(applyButton).toBeDisabled();
    
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    const fromInput = inputs[0];
    fireEvent.change(fromInput, { target: { value: '2024-01-15' } });
    
    expect(applyButton).toBeEnabled();
  });

  it('calls setDateRange when apply button is clicked', async () => {
    render(<DatePicker {...defaultProps} />);
    
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    const fromInput = inputs[0];
    const toInput = inputs[1];
    const applyButton = screen.getByText('Apply Filter');
    
    fireEvent.change(fromInput, { target: { value: '2024-01-15' } });
    fireEvent.change(toInput, { target: { value: '2024-01-31' } });
    fireEvent.click(applyButton);
    
    await waitFor(() => {
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: new Date('2024-01-15'),
        to: new Date('2024-01-31')
      });
    });
  });

  it('handles invalid dates gracefully', async () => {
    render(<DatePicker {...defaultProps} />);
    
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    const fromInput = inputs[0];
    const applyButton = screen.getByText('Apply Filter');
    
    // Enter invalid date directly
    fireEvent.change(fromInput, { target: { value: 'invalid-date' } });
    
    // Button should remain disabled for invalid dates
    expect(applyButton).toBeDisabled();
    
    // Enter valid date to enable button
    fireEvent.change(fromInput, { target: { value: '2024-01-15' } });
    expect(applyButton).toBeEnabled();
    
    // Click button to test valid date handling
    fireEvent.click(applyButton);
    
    await waitFor(() => {
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: new Date('2024-01-15'),
        to: undefined
      });
    });
  });

  it('displays existing date range when provided', () => {
    const propsWithDates = {
      dateRange: {
        from: new Date('2024-01-15'),
        to: new Date('2024-01-31')
      },
      setDateRange: mockSetDateRange,
    };
    
    render(<DatePicker {...propsWithDates} />);
    
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    const fromInput = inputs[0];
    const toInput = inputs[1];
    
    expect(fromInput).toHaveValue('2024-01-15');
    expect(toInput).toHaveValue('2024-01-31');
  });

  it('applies custom className when provided', () => {
    render(<DatePicker {...defaultProps} className="custom-class" />);
    
    const container = screen.getByText('Date Range Filter').closest('.card');
    expect(container).toHaveClass('custom-class');
  });
}); 