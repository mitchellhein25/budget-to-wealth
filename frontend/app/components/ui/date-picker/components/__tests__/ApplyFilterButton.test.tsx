import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplyFilterButton from '@/app/components/ui/date-picker/components/ApplyFilterButton';

describe('ApplyFilterButton', () => {
  const mockHandleSetRange = jest.fn();
  const mockHasChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text', () => {
    mockHasChanges.mockReturnValue(false);
    
    render(<ApplyFilterButton handleSetRange={mockHandleSetRange} hasChanges={mockHasChanges} />);
    
    expect(screen.getByText('Apply Filter')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('is disabled when hasChanges returns false', () => {
    mockHasChanges.mockReturnValue(false);
    
    render(<ApplyFilterButton handleSetRange={mockHandleSetRange} hasChanges={mockHasChanges} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn-disabled');
    expect(button).not.toHaveClass('btn-primary');
  });

  it('is enabled when hasChanges returns true', () => {
    mockHasChanges.mockReturnValue(true);
    
    render(<ApplyFilterButton handleSetRange={mockHandleSetRange} hasChanges={mockHasChanges} />);
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass('btn-primary');
    expect(button).not.toHaveClass('btn-disabled');
  });

  it('calls handleSetRange when clicked and enabled', () => {
    mockHasChanges.mockReturnValue(true);
    
    render(<ApplyFilterButton handleSetRange={mockHandleSetRange} hasChanges={mockHasChanges} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockHandleSetRange).toHaveBeenCalledTimes(1);
  });

  it('does not call handleSetRange when clicked and disabled', () => {
    mockHasChanges.mockReturnValue(false);
    
    render(<ApplyFilterButton handleSetRange={mockHandleSetRange} hasChanges={mockHasChanges} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockHandleSetRange).not.toHaveBeenCalled();
  });

  it('calls hasChanges function to determine button state', () => {
    mockHasChanges.mockReturnValue(true);
    
    render(<ApplyFilterButton handleSetRange={mockHandleSetRange} hasChanges={mockHasChanges} />);
    
    // hasChanges is called twice - once for disabled prop and once for className
    expect(mockHasChanges).toHaveBeenCalledTimes(2);
  });

  it('updates button state when hasChanges result changes', () => {
    mockHasChanges.mockReturnValue(false);
    
    const { rerender } = render(<ApplyFilterButton handleSetRange={mockHandleSetRange} hasChanges={mockHasChanges} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
    
    mockHasChanges.mockReturnValue(true);
    rerender(<ApplyFilterButton handleSetRange={mockHandleSetRange} hasChanges={mockHasChanges} />);
    
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
});
