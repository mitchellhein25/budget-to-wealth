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
  datesAreFullMonthRange: jest.fn((from: Date | string | undefined, to: Date | string | undefined) => {
    if (!from || !to) return false;
    
    let fromStr: string, toStr: string;
    if (from instanceof Date) {
      fromStr = from.toISOString().slice(0, 10);
    } else {
      fromStr = from;
    }
    if (to instanceof Date) {
      toStr = to.toISOString().slice(0, 10);
    } else {
      toStr = to;
    }
    
    const fromParts = fromStr.split('-');
    const toParts = toStr.split('-');
    
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
  getFullMonthRange: jest.fn((date: Date) => ({
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

  it('renders the component with title and date range inputs by default when no dates provided', () => {
    render(<DatePicker {...defaultProps} />);
    
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByLabelText('Specific date range')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filter/i })).toBeInTheDocument();
    
    const checkbox = screen.getByLabelText('Specific date range');
    expect(checkbox).toBeChecked();
  });

  it('shows month/year selects when checkbox is unchecked', () => {
    render(<DatePicker {...defaultProps} />);
    
    const checkbox = screen.getByLabelText('Specific date range');
    
    // Initially in date range mode (checkbox checked)
    expect(checkbox).toBeChecked();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    
    // Uncheck the checkbox to switch to month/year mode
    fireEvent.click(checkbox);
    
    // Now month/year selects should be visible
    expect(checkbox).not.toBeChecked();
    expect(screen.getByDisplayValue('Select Month')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('YYYY')).toBeInTheDocument();
    expect(screen.queryByText('From')).not.toBeInTheDocument();
  });

  it('updates input values when user types in date range mode', () => {
    render(<DatePicker {...defaultProps} />);
    
    // Already in date range mode by default
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
    
    // Switch to month/year mode first
    const checkbox = screen.getByLabelText('Specific date range');
    fireEvent.click(checkbox);
    
    const applyButton = screen.getByRole('button', { name: /apply filter/i });
    expect(applyButton).toBeDisabled();
    
    const monthSelect = screen.getByDisplayValue('Select Month');
    const yearInput = screen.getByDisplayValue('');
    
    fireEvent.change(monthSelect, { target: { value: '1' } });
    fireEvent.change(yearInput, { target: { value: '2024' } });
    
    expect(applyButton).toBeEnabled();
  });

  it('calls setDateRange when apply button is clicked with month/year', async () => {
    render(<DatePicker {...defaultProps} />);
    
    // Switch to month/year mode first
    const checkbox = screen.getByLabelText('Specific date range');
    fireEvent.click(checkbox);
    
    const monthSelect = screen.getByDisplayValue('Select Month');
    const yearInput = screen.getByDisplayValue('');
    const applyButton = screen.getByRole('button', { name: /apply filter/i });
    
    fireEvent.change(monthSelect, { target: { value: '1' } });
    fireEvent.change(yearInput, { target: { value: '2024' } });
    fireEvent.click(applyButton);
    
    await waitFor(() => {
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31')
      });
    });
  });

  it('toggles between date range and month/year modes', () => {
    render(<DatePicker {...defaultProps} />);
    
    const checkbox = screen.getByLabelText('Specific date range');
    
    // Initially in date range mode
    expect(checkbox).toBeChecked();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Select Month')).not.toBeInTheDocument();
    
    // Switch to month/year mode
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(screen.getByDisplayValue('Select Month')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('YYYY')).toBeInTheDocument();
    expect(screen.queryByText('From')).not.toBeInTheDocument();
    
    // Switch back to date range mode
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.queryByDisplayValue('Select Month')).not.toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<DatePicker {...defaultProps} className="custom-class" />);
    
    const container = screen.getByText('Date Range').closest('.card');
    expect(container).toHaveClass('custom-class');
  });

  it('updates internal dates when month/year is selected', () => {
    render(<DatePicker {...defaultProps} />);
    
    // Switch to month/year mode first
    const checkbox = screen.getByLabelText('Specific date range');
    fireEvent.click(checkbox);
    
    const monthSelect = screen.getByDisplayValue('Select Month');
    const yearInput = screen.getByDisplayValue('');
    
    fireEvent.change(monthSelect, { target: { value: '1' } });
    fireEvent.change(yearInput, { target: { value: '2024' } });
    
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
    
    // Should be in month/year mode for full month range
    const checkbox = screen.getByLabelText('Specific date range');
    expect(checkbox).not.toBeChecked();
    
    // Verify month/year inputs are present and year is set correctly  
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
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
    
    const checkbox = screen.getByLabelText('Specific date range');
    expect(checkbox).toBeChecked();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    expect(inputs[0]).toHaveValue('2024-01-15');
    expect(inputs[1]).toHaveValue('2024-01-25');
  });
}); 