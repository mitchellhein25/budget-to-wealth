import { render, screen, fireEvent } from '@testing-library/react';
import { ResetButton } from '@/app/components';

describe('ResetButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct text', () => {
    render(<ResetButton onClick={mockOnClick} isHidden={false} />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<ResetButton onClick={mockOnClick} isHidden={false} />);
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has correct button type', () => {
    render(<ResetButton onClick={mockOnClick} isHidden={false} />);
    
    const resetButton = screen.getByText('Reset');
    expect(resetButton).toHaveAttribute('type', 'reset');
  });

  it('is hidden when isHidden is true', () => {
    render(<ResetButton onClick={mockOnClick} isHidden={true} />);
    
    const resetButton = screen.getByText('Reset');
    expect(resetButton).toHaveAttribute('hidden');
  });

  it('is visible when isHidden is false', () => {
    render(<ResetButton onClick={mockOnClick} isHidden={false} />);
    
    const resetButton = screen.getByText('Reset');
    expect(resetButton).not.toHaveAttribute('hidden');
  });
}); 