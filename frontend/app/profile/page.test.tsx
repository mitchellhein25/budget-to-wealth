import { render, screen } from '@testing-library/react';
import Profile from './page';

const profileTitleText = 'Profile';
const loginPromptText = 'Please log in to view your profile.';
const logoutButtonText = 'Logout';

jest.mock('@/app/lib/auth/auth0', () => ({
  auth0: {
    getSession: jest.fn(),
  },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

describe('Profile', () => {
  const mockAuth0 = require('@/app/lib/auth/auth0').auth0;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows login prompt when user is not authenticated', async () => {
    mockAuth0.getSession.mockResolvedValue(null);
    
    const ProfileComponent = await Profile();
    render(ProfileComponent);
    
    expect(screen.getByText(profileTitleText)).toBeInTheDocument();
    expect(screen.getByText(loginPromptText)).toBeInTheDocument();
  });

  it('shows user profile when authenticated', async () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'https://example.com/avatar.jpg',
    };
    
    mockAuth0.getSession.mockResolvedValue({ user: mockUser });
    
    const ProfileComponent = await Profile();
    render(ProfileComponent);
    
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(logoutButtonText)).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', mockUser.picture);
  });

  it('shows fallback avatar when user has no picture', async () => {
    const mockUser = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      picture: null,
    };
    
    mockAuth0.getSession.mockResolvedValue({ user: mockUser });
    
    const ProfileComponent = await Profile();
    render(ProfileComponent);
    
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(logoutButtonText)).toBeInTheDocument();
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
  });

  it('handles session with user but no user data', async () => {
    mockAuth0.getSession.mockResolvedValue({ user: {} });
    
    const ProfileComponent = await Profile();
    render(ProfileComponent);
    
    expect(screen.getByText(logoutButtonText)).toBeInTheDocument();
  });
}); 