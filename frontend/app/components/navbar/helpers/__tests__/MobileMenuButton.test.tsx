import { render, screen } from '@testing-library/react';
import { MobileMenuButton } from '../MobileMenuButton';

jest.mock('lucide-react', () => ({
  Menu: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="menu-icon" />
  ),
}));

describe('MobileMenuButton', () => {
  it('renders the mobile menu button', () => {
    render(<MobileMenuButton />);

    const button = screen.getByLabelText('open sidebar');
    expect(button).toBeInTheDocument();
  });

  it('renders with correct container classes', () => {
    render(<MobileMenuButton />);

    const container = screen.getByLabelText('open sidebar').closest('.flex-none');
    expect(container).toHaveClass('flex-none', 'lg:hidden');
  });

  it('renders with correct button classes', () => {
    render(<MobileMenuButton />);

    const button = screen.getByLabelText('open sidebar');
    expect(button).toHaveClass('btn', 'btn-square', 'btn-ghost');
  });

  it('renders the menu icon', () => {
    render(<MobileMenuButton />);

    const menuIcon = screen.getByTestId('menu-icon');
    expect(menuIcon).toBeInTheDocument();
  });

  it('renders menu icon with correct classes', () => {
    render(<MobileMenuButton />);

    const menuIcon = screen.getByTestId('menu-icon');
    expect(menuIcon).toHaveClass('w-6', 'h-6');
  });

  it('has correct accessibility attributes', () => {
    render(<MobileMenuButton />);

    const button = screen.getByLabelText('open sidebar');
    expect(button).toHaveAttribute('aria-label', 'open sidebar');
  });

  it('has correct htmlFor attribute', () => {
    render(<MobileMenuButton />);

    const button = screen.getByLabelText('open sidebar');
    expect(button).toHaveAttribute('for', 'mobile-drawer');
  });

  it('renders as a label element', () => {
    render(<MobileMenuButton />);

    const button = screen.getByLabelText('open sidebar');
    expect(button.tagName).toBe('LABEL');
  });

  it('contains the menu icon inside the button', () => {
    render(<MobileMenuButton />);

    const button = screen.getByLabelText('open sidebar');
    const menuIcon = screen.getByTestId('menu-icon');
    expect(button).toContainElement(menuIcon);
  });
}); 