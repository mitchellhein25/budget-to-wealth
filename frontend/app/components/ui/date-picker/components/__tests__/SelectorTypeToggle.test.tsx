import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectorTypeToggle from '@/app/components/ui/date-picker/components/SelectorTypeToggle';

describe('SelectorTypeToggle', () => {
  const mockHandleDateRangeToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders checkbox with correct label', () => {
    render(<SelectorTypeToggle showDateRange={false} handleDateRangeToggle={mockHandleDateRangeToggle} />);
    
    expect(screen.getByLabelText('Specific date range')).toBeInTheDocument();
    expect(screen.getByText('Specific date range')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('is unchecked when showDateRange is false', () => {
    render(<SelectorTypeToggle showDateRange={false} handleDateRangeToggle={mockHandleDateRangeToggle} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('is checked when showDateRange is true', () => {
    render(<SelectorTypeToggle showDateRange={true} handleDateRangeToggle={mockHandleDateRangeToggle} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls handleDateRangeToggle when clicked', () => {
    render(<SelectorTypeToggle showDateRange={false} handleDateRangeToggle={mockHandleDateRangeToggle} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandleDateRangeToggle).toHaveBeenCalledTimes(1);
    expect(mockHandleDateRangeToggle).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        type: 'checkbox'
      })
    }));
  });

  it('calls handleDateRangeToggle when label is clicked', () => {
    render(<SelectorTypeToggle showDateRange={false} handleDateRangeToggle={mockHandleDateRangeToggle} />);
    
    const label = screen.getByText('Specific date range');
    fireEvent.click(label);
    
    expect(mockHandleDateRangeToggle).toHaveBeenCalledTimes(1);
  });

  it('updates checked state when showDateRange prop changes', () => {
    const { rerender } = render(
      <SelectorTypeToggle showDateRange={false} handleDateRangeToggle={mockHandleDateRangeToggle} />
    );
    
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    
    rerender(<SelectorTypeToggle showDateRange={true} handleDateRangeToggle={mockHandleDateRangeToggle} />);
    
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('has correct CSS classes for styling', () => {
    render(<SelectorTypeToggle showDateRange={false} handleDateRangeToggle={mockHandleDateRangeToggle} />);
    
    const container = screen.getByRole('checkbox').closest('.form-control');
    const label = screen.getByText('Specific date range').closest('label');
    const checkbox = screen.getByRole('checkbox');
    
    expect(container).toHaveClass('form-control');
    expect(label).toHaveClass('label', 'cursor-pointer');
    expect(checkbox).toHaveClass('checkbox', 'checkbox-primary');
  });
});
