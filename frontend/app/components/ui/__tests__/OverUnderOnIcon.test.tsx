import { render, screen } from '@testing-library/react';
import OverUnderOnIcon from '../OverUnderOnIcon';

jest.mock('lucide-react', () => ({
  Equal: ({ size, className }: { size: number; className: string }) => <svg data-testid="equal-icon" width={size} height={size} className={className} />,
  ArrowUp: ({ size, className }: { size: number; className: string }) => <svg data-testid="arrow-up-icon" width={size} height={size} className={className} />,
  ArrowDown: ({ size, className }: { size: number; className: string }) => <svg data-testid="arrow-down-icon" width={size} height={size} className={className} />,
}));

describe('OverUnderOnIcon', () => {
  const testSize = 24;

  it('renders Equal icon with yellow color when value is 0', () => {
    render(<OverUnderOnIcon value={0} size={testSize} />);
    
    const icon = screen.getByTestId('equal-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-yellow-500');
    expect(icon).toHaveAttribute('width', testSize.toString());
    expect(icon).toHaveAttribute('height', testSize.toString());
  });

  it('renders ArrowUp icon with green color when value is positive (default)', () => {
    render(<OverUnderOnIcon value={5} size={testSize} />);
    
    const icon = screen.getByTestId('arrow-up-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-green-500');
    expect(icon).toHaveAttribute('width', testSize.toString());
    expect(icon).toHaveAttribute('height', testSize.toString());
  });

  it('renders ArrowDown icon with red color when value is negative (default)', () => {
    render(<OverUnderOnIcon value={-3} size={testSize} />);
    
    const icon = screen.getByTestId('arrow-down-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-red-500');
    expect(icon).toHaveAttribute('width', testSize.toString());
    expect(icon).toHaveAttribute('height', testSize.toString());
  });

  it('renders ArrowDown icon with green color when value is positive and inverted', () => {
    render(<OverUnderOnIcon value={5} size={testSize} inverted={true} />);
    
    const icon = screen.getByTestId('arrow-down-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-green-500');
    expect(icon).toHaveAttribute('width', testSize.toString());
    expect(icon).toHaveAttribute('height', testSize.toString());
  });

  it('renders ArrowUp icon with red color when value is negative and inverted', () => {
    render(<OverUnderOnIcon value={-3} size={testSize} inverted={true} />);
    
    const icon = screen.getByTestId('arrow-up-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-red-500');
    expect(icon).toHaveAttribute('width', testSize.toString());
    expect(icon).toHaveAttribute('height', testSize.toString());
  });

  it('passes size prop correctly to all icon variants', () => {
    const customSize = 32;
    
    const { rerender } = render(<OverUnderOnIcon value={0} size={customSize} />);
    expect(screen.getByTestId('equal-icon')).toHaveAttribute('width', customSize.toString());
    expect(screen.getByTestId('equal-icon')).toHaveAttribute('height', customSize.toString());
    
    rerender(<OverUnderOnIcon value={1} size={customSize} />);
    expect(screen.getByTestId('arrow-up-icon')).toHaveAttribute('width', customSize.toString());
    expect(screen.getByTestId('arrow-up-icon')).toHaveAttribute('height', customSize.toString());
    
    rerender(<OverUnderOnIcon value={-1} size={customSize} />);
    expect(screen.getByTestId('arrow-down-icon')).toHaveAttribute('width', customSize.toString());
    expect(screen.getByTestId('arrow-down-icon')).toHaveAttribute('height', customSize.toString());
  });

  it('defaults inverted prop to false', () => {
    render(<OverUnderOnIcon value={5} size={testSize} />);
    
    const icon = screen.getByTestId('arrow-up-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-green-500');
  });
});
