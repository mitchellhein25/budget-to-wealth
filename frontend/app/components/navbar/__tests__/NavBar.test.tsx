import { render, screen } from '@testing-library/react';
import { SessionData } from '@auth0/nextjs-auth0/types';
import { usePathname } from 'next/navigation';
import { NavBar } from '@/app/components/navbar/NavBar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  Logo: ({ className }: { className?: string }) => (
    <div data-testid="logo" className={className}>Logo Component</div>
  ),
  UserProfile: ({ session, pathname }: { session: SessionData, pathname: string }) => (
    <div data-testid="user-profile" data-session={JSON.stringify(session)} data-pathname={pathname}>
      UserProfile Component
    </div>
  ),
  DesktopNav: ({ pathname }: { pathname: string }) => (
    <div data-testid="desktop-nav" data-pathname={pathname}>DesktopNav Component</div>
  ),
  MobileDrawer: ({ pathname, onClose }: { pathname: string, onClose: () => void }) => (
    <div className="drawer-side" data-testid="mobile-drawer" data-pathname={pathname} onClick={onClose}>
      MobileDrawer Component
    </div>
  ),
  MobileMenuButton: () => <div data-testid="mobile-menu-button">MobileMenuButton Component</div>,
  closeDrawer: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('NavBar', () => {
  const mockSession: SessionData = {
    user: {
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/avatar.jpg',
      sub: 'test-user-id',
    },
    tokenSet: {
      accessToken: 'test-token',
      expiresAt: Date.now() / 1000 + 3600,
    },
    internal: {
      sid: 'test-session-id',
      createdAt: Date.now(),
    },
  };

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/test-path');
  });

  it('renders the main navbar structure', () => {
    render(<NavBar session={mockSession} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getAllByTestId('logo')).toHaveLength(2);
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-drawer')).toBeInTheDocument();
  });

  it('passes correct props to helper components', () => {
    const testPathname = '/cashflow/expenses';
    mockUsePathname.mockReturnValue(testPathname);

    render(<NavBar session={mockSession} />);

    const userProfile = screen.getByTestId('user-profile');
    expect(userProfile).toHaveAttribute('data-session', JSON.stringify(mockSession));
    expect(userProfile).toHaveAttribute('data-pathname', testPathname);

    const desktopNav = screen.getByTestId('desktop-nav');
    expect(desktopNav).toHaveAttribute('data-pathname', testPathname);

    const mobileDrawer = screen.getByTestId('mobile-drawer');
    expect(mobileDrawer).toHaveAttribute('data-pathname', testPathname);
  });

  it('renders with drawer structure for mobile responsiveness', () => {
    render(<NavBar session={mockSession} />);

    const drawer = screen.getByRole('navigation').closest('.drawer');
    expect(drawer).toBeInTheDocument();

    const drawerContent = drawer?.querySelector('.drawer-content');
    expect(drawerContent).toBeInTheDocument();

    const drawerSide = drawer?.querySelector('.drawer-side');
    expect(drawerSide).toBeInTheDocument();
  });

  it('renders navbar with correct layout classes', () => {
    render(<NavBar session={mockSession} />);

    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('navbar', 'px-3', 'sm:px-4', 'lg:px-8', 'max-w-7xl', 'mx-auto');

    const navbarStart = navbar.querySelector('.navbar-start');
    expect(navbarStart).toBeInTheDocument();

    const navbarCenter = navbar.querySelector('.navbar-center');
    expect(navbarCenter).toBeInTheDocument();
  });

  it('renders logo with correct responsive classes', () => {
    render(<NavBar session={mockSession} />);

    const logos = screen.getAllByTestId('logo');
    expect(logos).toHaveLength(2);

    const desktopLogo = logos[0];
    expect(desktopLogo).toHaveClass('hidden', 'lg:flex');

    const mobileLogo = logos[1];
    expect(mobileLogo).not.toHaveClass('lg:hidden');
  });

  it('renders mobile menu button with correct classes', () => {
    render(<NavBar session={mockSession} />);

    const mobileMenuButton = screen.getByTestId('mobile-menu-button');
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('handles null session gracefully', () => {
    render(<NavBar session={null as SessionData | null} />);

    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    expect(screen.getByTestId('user-profile')).toHaveAttribute('data-session', 'null');
  });


});  