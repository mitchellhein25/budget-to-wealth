import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryToggle } from '../HistoryToggle';

describe('HistoryToggle', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the checkbox and label correctly', () => {
    render(<HistoryToggle onToggle={mockOnToggle} isLoading={false} />);
    
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByLabelText('Show all history')).toBeInTheDocument();
    expect(screen.getByText('Show all history')).toBeInTheDocument();
  });

  it('calls onToggle with true when checkbox is checked', () => {
    render(<HistoryToggle onToggle={mockOnToggle} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  it('calls onToggle with false when checkbox is unchecked', () => {
    render(<HistoryToggle onToggle={mockOnToggle} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    
    // First check it
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith(true);
    
    // Then uncheck it
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  it('shows loading state when isLoading is true', () => {
    render(<HistoryToggle onToggle={mockOnToggle} isLoading={true} />);
    
    expect(screen.getByText('Updating…')).toBeInTheDocument();
    const spinner = screen.getByText('Updating…').closest('div')?.querySelector('.loading');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('loading', 'loading-spinner', 'loading-sm');
  });

  it('does not show loading state when isLoading is false', () => {
    render(<HistoryToggle onToggle={mockOnToggle} isLoading={false} />);
    
    expect(screen.queryByText('Updating…')).not.toBeInTheDocument();
    expect(screen.queryByText('Updating…')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<HistoryToggle onToggle={mockOnToggle} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('maintains checkbox state independently of loading state', () => {
    const { rerender } = render(<HistoryToggle onToggle={mockOnToggle} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    
    // Check the checkbox
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith(true);
    
    // Change to loading state
    rerender(<HistoryToggle onToggle={mockOnToggle} isLoading={true} />);
    
    // Checkbox should still be checked
    expect(checkbox).toBeChecked();
  });

  it('calls onToggle multiple times correctly', () => {
    render(<HistoryToggle onToggle={mockOnToggle} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    
    // Multiple clicks
    fireEvent.click(checkbox); // Check
    fireEvent.click(checkbox); // Uncheck
    fireEvent.click(checkbox); // Check again
    
    expect(mockOnToggle).toHaveBeenCalledTimes(3);
    expect(mockOnToggle).toHaveBeenNthCalledWith(1, true);
    expect(mockOnToggle).toHaveBeenNthCalledWith(2, false);
    expect(mockOnToggle).toHaveBeenNthCalledWith(3, true);
  });

  it('renders with correct CSS classes', () => {
    render(<HistoryToggle onToggle={mockOnToggle} isLoading={false} />);
    
    const container = screen.getByText('Show all history').closest('div');
    expect(container).toHaveClass('flex', 'items-center', 'gap-4');
    
    const label = screen.getByText('Show all history').closest('label');
    expect(label).toHaveClass('label', 'cursor-pointer', 'gap-2', 'm-0');
  });

  it('renders loading spinner with correct classes', () => {
    render(<HistoryToggle onToggle={mockOnToggle} isLoading={true} />);
    
    const loadingContainer = screen.getByText('Updating…').closest('div');
    expect(loadingContainer).toHaveClass('flex', 'items-center', 'gap-2', 'text-sm', 'text-base-content/70');
    
    const spinner = screen.getByText('Updating…').closest('div')?.querySelector('.loading');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('loading', 'loading-spinner', 'loading-sm');
  });
});
