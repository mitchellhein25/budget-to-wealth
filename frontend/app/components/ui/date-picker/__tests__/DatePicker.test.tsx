import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DatePicker } from '@/app/components';

jest.mock('@/app/lib/utils', () => ({
  convertDateToISOString: jest.fn((date) => date?.toISOString().slice(0, 10) ?? ''),
  replaceSpacesWithDashes: jest.fn((str: string) => str.replace(/\s+/g, '-')),
  convertToDate: jest.fn((date: string, noMonthAdjustment?: boolean) => {
    if (!date) return new Date();
    const [year, month, day] = date.split('-').map(Number);
    const adjustedMonth = noMonthAdjustment ? month - 1 : month - 1;
    return new Date(Date.UTC(year, adjustedMonth, day, 12));
  }),
  datesAreCurrentFullMonthRange: jest.fn((from: string, to: string) => {
    if (!from || !to) return false;
    
    const fromParts = from.split('-');
    const toParts = to.split('-');
    
    if (fromParts.length !== 3 || toParts.length !== 3) return false;
    
    const fromYear = parseInt(fromParts[0], 10);
    const fromMonth = parseInt(fromParts[1], 10);
    const fromDate = parseInt(fromParts[2], 10);
    const toYear = parseInt(toParts[0], 10);
    const toMonth = parseInt(toParts[1], 10);
    const toDate = parseInt(toParts[2], 10);
    
    if (fromYear === toYear && fromMonth === toMonth) {
      const lastDayOfMonth = new Date(fromYear, fromMonth, 0).getDate();
      return fromDate === 1 && toDate === lastDayOfMonth;
    }
    return false;
  }),
  getCurrentMonthRange: jest.fn((date: Date) => ({
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  })),
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

  it('renders the component with title and month/year selects by default', () => {
    render(<DatePicker {...defaultProps} />);
    
    expect(screen.getByText('Date Range Filter')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select Month')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Year')).toBeInTheDocument();
    expect(screen.getByLabelText('Select specific date range')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filter/i })).toBeInTheDocument();
  });

  it('shows date inputs when checkbox is checked', () => {
    render(<DatePicker {...defaultProps} />);
    
    const checkbox = screen.getByLabelText('Select specific date range');
    
    // Initially, date inputs should not be visible
    expect(screen.queryByText('From Date')).not.toBeInTheDocument();
    expect(screen.queryByText('To Date')).not.toBeInTheDocument();
    
    // Check the checkbox
    fireEvent.click(checkbox);
    
    // Now date inputs should be visible
    expect(screen.getByText('From Date')).toBeInTheDocument();
    expect(screen.getByText('To Date')).toBeInTheDocument();
    
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    expect(inputs).toHaveLength(2);
    
    inputs.forEach(input => {
      expect(input).toHaveAttribute('type', 'date');
    });
  });

  it('updates input values when user types in date range mode', () => {
    render(<DatePicker {...defaultProps} />);
    
    // Enable date range mode
    const checkbox = screen.getByLabelText('Select specific date range');
    fireEvent.click(checkbox);
    
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    const fromInput = inputs[0];
    const toInput = inputs[1];
    
    fireEvent.change(fromInput, { target: { value: '2024-01-15' } });
    fireEvent.change(toInput, { target: { value: '2024-01-31' } });
    
    expect(fromInput).toHaveValue('2024-01-15');
    expect(toInput).toHaveValue('2024-01-31');
  });

  it('enables apply button when month and year are selected', () => {
    render(<DatePicker {...defaultProps} />);
    
    const applyButton = screen.getByRole('button', { name: /apply filter/i });
    expect(applyButton).toBeDisabled();
    
    const monthSelect = screen.getByDisplayValue('Select Month');
    const yearSelect = screen.getByDisplayValue('Year');
    
    fireEvent.change(monthSelect, { target: { value: '1' } });
    fireEvent.change(yearSelect, { target: { value: '2024' } });
    
    expect(applyButton).toBeEnabled();
  });

  it('calls setDateRange when apply button is clicked with month/year', async () => {
    render(<DatePicker {...defaultProps} />);
    
    const monthSelect = screen.getByDisplayValue('Select Month');
    const yearSelect = screen.getByDisplayValue('Year');
    const applyButton = screen.getByRole('button', { name: /apply filter/i });
    
    fireEvent.change(monthSelect, { target: { value: '1' } });
    fireEvent.change(yearSelect, { target: { value: '2024' } });
    fireEvent.click(applyButton);
    
    await waitFor(() => {
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31')
      });
    });
  });

  it('toggles between month/year and date range modes', () => {
    render(<DatePicker {...defaultProps} />);
    
    const checkbox = screen.getByLabelText('Select specific date range');
    
    // Initially in month/year mode
    expect(checkbox).not.toBeChecked();
    expect(screen.getByDisplayValue('Select Month')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Year')).toBeInTheDocument();
    expect(screen.queryByText('From Date')).not.toBeInTheDocument();
    
    // Switch to date range mode
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.queryByDisplayValue('Select Month')).not.toBeInTheDocument();
    expect(screen.getByText('From Date')).toBeInTheDocument();
    expect(screen.getByText('To Date')).toBeInTheDocument();
    
    // Switch back to month/year mode
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(screen.getByDisplayValue('Select Month')).toBeInTheDocument();
    expect(screen.queryByText('From Date')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<DatePicker {...defaultProps} className="custom-class" />);
    
    const container = screen.getByText('Date Range Filter').closest('.card');
    expect(container).toHaveClass('custom-class');
  });

  it('updates internal dates when month/year is selected', () => {
    render(<DatePicker {...defaultProps} />);
    
    const monthSelect = screen.getByDisplayValue('Select Month');
    const yearSelect = screen.getByDisplayValue('Year');
    
    fireEvent.change(monthSelect, { target: { value: '1' } });
    fireEvent.change(yearSelect, { target: { value: '2024' } });
    
    const applyButton = screen.getByRole('button', { name: /apply filter/i });
    expect(applyButton).toBeEnabled();
  });

  it('displays month/year when full month range is provided', () => {
    const propsWithFullMonth = {
      dateRange: {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31')
      },
      setDateRange: mockSetDateRange,
    };
    
    render(<DatePicker {...propsWithFullMonth} />);
    
    const monthSelect = screen.getByDisplayValue('January');
    const yearSelect = screen.getByDisplayValue('2024');
    expect(monthSelect).toBeInTheDocument();
    expect(yearSelect).toBeInTheDocument();
  });

  it('switches to date range mode when partial month is provided', () => {
    const propsWithPartialMonth = {
      dateRange: {
        from: new Date('2024-01-15'),
        to: new Date('2024-01-25')
      },
      setDateRange: mockSetDateRange,
    };
    
    render(<DatePicker {...propsWithPartialMonth} />);
    
    const checkbox = screen.getByLabelText('Select specific date range');
    expect(checkbox).toBeChecked();
    expect(screen.getByText('From Date')).toBeInTheDocument();
    expect(screen.getByText('To Date')).toBeInTheDocument();
  });
}); 