import { render, screen } from '@testing-library/react';
import { SessionData } from '@auth0/nextjs-auth0/types';
import { isAuthenticated } from '@/app/lib/auth';
import { UserProfile } from '@/app/components';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, className, children, title }: { href: string; className?: string; children: React.ReactNode; title?: string }) => (
    <a href={href} className={className} title={title} data-testid={`link-${href}`}>
      {children}
    </a>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} data-testid="user-avatar" />
  ),
}));

jest.mock('lucide-react', () => ({
  Import: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="import-icon" />
  ),
  User: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="user-icon" />
  ),
}));

jest.mock('@/app/lib/auth', () => ({
  isAuthenticated: jest.fn(),
}));

const mockIsAuthenticated = isAuthenticated as jest.MockedFunction<() => boolean>;

describe('UserProfile', () => {
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
    mockIsAuthenticated.mockClear();
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockIsAuthenticated.mockReturnValue(false);
    });

    it('renders login button', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const loginButton = screen.getByRole('link', { name: /login/i });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveAttribute('href', '/auth/login?returnTo=%2Ftest');
    });

    it('renders login button with correct classes', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const loginButton = screen.getByRole('link', { name: /login/i });
      expect(loginButton).toHaveClass('btn', 'btn-primary');
    });

    it('includes returnTo parameter in login URL', () => {
      render(<UserProfile session={mockSession} pathname="/cashflow/budget" />);

      const loginButton = screen.getByRole('link', { name: /login/i });
      expect(loginButton).toHaveAttribute('href', '/auth/login?returnTo=%2Fcashflow%2Fbudget');
    });

    it('handles root pathname correctly', () => {
      render(<UserProfile session={mockSession} pathname="/" />);

      const loginButton = screen.getByRole('link', { name: /login/i });
      expect(loginButton).toHaveAttribute('href', '/auth/login?returnTo=%2F');
    });

    it('renders in navbar-end container', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const container = screen.getByRole('link', { name: /login/i }).closest('.navbar-end');
      expect(container).toBeInTheDocument();
    });

    it('does not render import button', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      expect(screen.queryByTestId('link-/import')).not.toBeInTheDocument();
    });

    it('does not render user dropdown', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      expect(screen.queryByRole('button', { name: /user/i })).not.toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockIsAuthenticated.mockReturnValue(true);
    });

    it('renders user dropdown button', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const dropdownButton = screen.getByRole('button');
      expect(dropdownButton).toBeInTheDocument();
    });

    it('renders user avatar when picture is available', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const userAvatar = screen.getByTestId('user-avatar');
      expect(userAvatar).toBeInTheDocument();
      expect(userAvatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(userAvatar).toHaveAttribute('alt', 'Profile');
    });

    it('renders user icon when picture is not available', () => {
      const sessionWithoutPicture = {
        ...mockSession,
        user: { ...mockSession.user, picture: undefined },
      };

      render(<UserProfile session={sessionWithoutPicture} pathname="/test" />);

      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toBeInTheDocument();
    });

    it('displays user name', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('displays fallback name when user name is not available', () => {
      const sessionWithoutName = {
        ...mockSession,
        user: { ...mockSession.user, name: undefined },
      };

      render(<UserProfile session={sessionWithoutName} pathname="/test" />);

      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('renders import button when not on import page', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const importButton = screen.getByTestId('link-/import');
      expect(importButton).toBeInTheDocument();
      expect(importButton).toHaveAttribute('title', 'Import Data');
    });

    it('does not render import button when on import page', () => {
      render(<UserProfile session={mockSession} pathname="/import" />);

      expect(screen.queryByTestId('link-/import')).not.toBeInTheDocument();
    });

    it('renders import button with correct classes', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const importButton = screen.getByTestId('link-/import');
      expect(importButton).toHaveClass('btn', 'btn-ghost', 'btn-circle', 'hidden', 'lg:flex');
    });

    it('renders import icon', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const importIcon = screen.getByTestId('import-icon');
      expect(importIcon).toBeInTheDocument();
      expect(importIcon).toHaveClass('w-5', 'h-5');
    });

    it('renders dropdown menu items', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      expect(screen.getByTestId('link-/profile')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
    });

    it('renders dropdown with correct classes', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const dropdownMenu = screen.getByTestId('link-/profile').closest('ul');
      expect(dropdownMenu).toHaveClass('dropdown-content', 'menu', 'p-2', 'shadow', 'bg-base-100', 'rounded-box', 'w-52');
    });

    it('renders dropdown button with correct classes', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const dropdownButton = screen.getByRole('button');
      expect(dropdownButton).toHaveClass('btn', 'btn-ghost', 'gap-2');
    });

    it('renders avatar container with correct classes', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const avatarContainer = screen.getByTestId('user-avatar').closest('.avatar');
      expect(avatarContainer).toBeInTheDocument();
    });

    it('renders avatar with correct classes', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const avatar = screen.getByTestId('user-avatar').closest('.w-8');
      expect(avatar).toHaveClass('w-8', 'h-8', 'rounded-full');
    });

    it('renders user name with responsive classes', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const userName = screen.getByText('Test User');
      expect(userName).toHaveClass('hidden', 'sm:inline');
    });

    it('renders in navbar-end container with spacing', () => {
      render(<UserProfile session={mockSession} pathname="/test" />);

      const container = screen.getByRole('button').closest('.navbar-end');
      expect(container).toHaveClass('navbar-end', 'space-x-2');
    });
  });

  describe('edge cases', () => {
    it('handles null session', () => {
      mockIsAuthenticated.mockReturnValue(false);
      render(<UserProfile session={null as SessionData | null} pathname="/test" />);

      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    it('handles undefined session', () => {
      mockIsAuthenticated.mockReturnValue(false);
      render(<UserProfile session={undefined as unknown as SessionData} pathname="/test" />);

      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    it('handles session without user', () => {
      mockIsAuthenticated.mockReturnValue(true);
      const sessionWithoutUser = { ...mockSession, user: undefined };

      render(<UserProfile session={sessionWithoutUser as unknown as SessionData} pathname="/test" />);

      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });
}); 