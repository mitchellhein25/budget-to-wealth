import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonthYearSelector from '@/app/components/ui/date-picker/components/MonthYearSelector';

jest.mock('@/app/components/ui/date-picker/components/functions', () => ({
  minYearOption: 2005,
  maxYearOption: 2045,
}));

describe('MonthYearSelector', () => {
  const mockHandleMonthChange = jest.fn();
  const mockHandleYearChange = jest.fn();

  const defaultProps = {
    selectedMonth: '',
    selectedYear: '',
    handleMonthChange: mockHandleMonthChange,
    handleYearChange: mockHandleYearChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders month and year labels and inputs', () => {
    render(<MonthYearSelector {...defaultProps} />);
    
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Month select
    expect(screen.getByRole('spinbutton')).toBeInTheDocument(); // Year input
  });

  it('renders all month options', () => {
    render(<MonthYearSelector {...defaultProps} />);
    
    const monthSelect = screen.getByRole('combobox');
    const options = monthSelect.querySelectorAll('option');
    
    expect(options).toHaveLength(13); // 12 months + "Select Month"
    expect(options[0]).toHaveTextContent('Select Month');
    expect(options[1]).toHaveTextContent('January');
    expect(options[2]).toHaveTextContent('February');
    expect(options[12]).toHaveTextContent('December');
  });

  it('sets correct values for month options', () => {
    render(<MonthYearSelector {...defaultProps} />);
    
    const monthSelect = screen.getByRole('combobox');
    const options = monthSelect.querySelectorAll('option');
    
    expect(options[0]).toHaveValue('');
    expect(options[1]).toHaveValue('1');
    expect(options[2]).toHaveValue('2');
    expect(options[12]).toHaveValue('12');
  });

  it('displays selected month value', () => {
    render(<MonthYearSelector {...defaultProps} selectedMonth="5" />);
    
    const monthSelect = screen.getByRole('combobox');
    expect(monthSelect).toHaveValue('5');
  });

  it('displays selected year value', () => {
    render(<MonthYearSelector {...defaultProps} selectedYear="2024" />);
    
    const yearInput = screen.getByRole('spinbutton');
    expect(yearInput).toHaveValue(2024);
  });

  it('calls handleMonthChange when month is selected', () => {
    render(<MonthYearSelector {...defaultProps} />);
    
    const monthSelect = screen.getByRole('combobox');
    fireEvent.change(monthSelect, { target: { value: '3' } });
    
    expect(mockHandleMonthChange).toHaveBeenCalledTimes(1);
    expect(mockHandleMonthChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.any(Object)
    }));
  });

  it('calls handleYearChange when year is changed', () => {
    render(<MonthYearSelector {...defaultProps} />);
    
    const yearInput = screen.getByRole('spinbutton');
    fireEvent.change(yearInput, { target: { value: '2025' } });
    
    expect(mockHandleYearChange).toHaveBeenCalledTimes(1);
    expect(mockHandleYearChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.any(Object)
    }));
  });

  it('sets correct min and max values for year input', () => {
    render(<MonthYearSelector {...defaultProps} />);
    
    const yearInput = screen.getByRole('spinbutton');
    expect(yearInput).toHaveAttribute('min', '2005');
    expect(yearInput).toHaveAttribute('max', '2045');
  });

  it('has correct placeholder for year input', () => {
    render(<MonthYearSelector {...defaultProps} />);
    
    const yearInput = screen.getByRole('spinbutton');
    expect(yearInput).toHaveAttribute('placeholder', 'YYYY');
  });

  it('handles empty string values correctly', () => {
    render(<MonthYearSelector {...defaultProps} selectedMonth="" selectedYear="" />);
    
    const monthSelect = screen.getByRole('combobox');
    const yearInput = screen.getByRole('spinbutton');
    
    expect(monthSelect).toHaveValue('');
    expect(yearInput).toHaveValue(null); // Number input with empty string shows as null
  });

  it('updates values when props change', () => {
    const { rerender } = render(<MonthYearSelector {...defaultProps} selectedMonth="1" selectedYear="2023" />);
    
    expect(screen.getByRole('combobox')).toHaveValue('1');
    expect(screen.getByRole('spinbutton')).toHaveValue(2023);
    
    rerender(<MonthYearSelector {...defaultProps} selectedMonth="12" selectedYear="2025" />);
    
    expect(screen.getByRole('combobox')).toHaveValue('12');
    expect(screen.getByRole('spinbutton')).toHaveValue(2025);
  });

  it('has correct CSS classes for styling', () => {
    render(<MonthYearSelector {...defaultProps} />);
    
    const container = screen.getByRole('combobox').closest('.form-control');
    const monthSelect = screen.getByRole('combobox');
    const yearInput = screen.getByRole('spinbutton');
    
    expect(container).toHaveClass('form-control');
    expect(monthSelect).toHaveClass('select', 'select-bordered');
    expect(yearInput).toHaveClass('input', 'input-bordered');
  });

  it('handles edge case year values', () => {
    render(<MonthYearSelector {...defaultProps} selectedYear="2005" />);
    
    const yearInput = screen.getByRole('spinbutton');
    expect(yearInput).toHaveValue(2005);
    
    // Test maximum year
    fireEvent.change(yearInput, { target: { value: '2045' } });
    expect(mockHandleYearChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.any(Object)
    }));
  });

  it('handles all month selections', () => {
    render(<MonthYearSelector {...defaultProps} />);
    
    const monthSelect = screen.getByRole('combobox');
    
    // Test first month
    fireEvent.change(monthSelect, { target: { value: '1' } });
    expect(mockHandleMonthChange).toHaveBeenCalledTimes(1);
    
    // Test last month
    fireEvent.change(monthSelect, { target: { value: '12' } });
    expect(mockHandleMonthChange).toHaveBeenCalledTimes(2);
    
    // Test deselection
    fireEvent.change(monthSelect, { target: { value: '' } });
    expect(mockHandleMonthChange).toHaveBeenCalledTimes(3);
  });
});
