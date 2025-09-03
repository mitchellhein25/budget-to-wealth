import { render, screen } from '@testing-library/react';
import { Logo } from '@/app/components';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
    <a href={href} className={className} data-testid="logo-link">
      {children}
    </a>
  ),
}));

describe('Logo', () => {
  it('renders with default props', () => {
    render(<Logo />);

    const logoLink = screen.getByTestId('logo-link');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
    expect(logoLink).toHaveClass('flex', 'items-center', 'gap-2', 'text-xl', 'font-bold', 'text-primary');
  });

  it('renders with custom className', () => {
    const customClass = 'custom-logo-class';
    render(<Logo className={customClass} />);

    const logoLink = screen.getByTestId('logo-link');
    expect(logoLink).toHaveClass('flex', 'items-center', 'gap-2', 'text-xl', 'font-bold', 'text-primary', customClass);
  });

  it('renders logo image with correct attributes', () => {
    render(<Logo />);

    const logoImage = screen.getByAltText('Budget to Wealth Logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/favicon.ico');
    expect(logoImage).toHaveAttribute('width', '24');
    expect(logoImage).toHaveAttribute('height', '24');
    expect(logoImage).toHaveClass('w-6', 'h-6');
  });

  it('renders logo text', () => {
    render(<Logo />);

    expect(screen.getByText('Budget to Wealth')).toBeInTheDocument();
  });

  it('renders as a link to home page', () => {
    render(<Logo />);

    const logoLink = screen.getByTestId('logo-link');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('applies custom className without affecting default classes', () => {
    const customClass = 'hidden lg:flex';
    render(<Logo className={customClass} />);

    const logoLink = screen.getByTestId('logo-link');
    expect(logoLink).toHaveClass('flex', 'items-center', 'gap-2', 'text-xl', 'font-bold', 'text-primary', customClass);
  });

  it('handles empty className', () => {
    render(<Logo className="" />);

    const logoLink = screen.getByTestId('logo-link');
    expect(logoLink).toHaveClass('flex', 'items-center', 'gap-2', 'text-xl', 'font-bold', 'text-primary');
  });

  it('renders with proper accessibility attributes', () => {
    render(<Logo />);

    const logoImage = screen.getByAltText('Budget to Wealth Logo');
    expect(logoImage).toHaveAttribute('alt', 'Budget to Wealth Logo');
  });
}); 