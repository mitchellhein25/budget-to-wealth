import { getAccessToken, auth0 } from '@/app/lib/auth';

jest.mock('@/app/lib/auth/auth0', () => ({
  auth0: {
    getSession: jest.fn()
  }
}));

const mockAuth0 = auth0 as jest.Mocked<typeof auth0>;

describe('getAccessToken', () => {
  const createMockSession = (overrides: Record<string, unknown> = {}) => ({
    user: {
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/avatar.jpg',
      sub: 'test-user-id',
    },
    tokenSet: {
      accessToken: 'mock-access-token-123',
      expiresAt: Date.now() / 1000 + 3600,
    },
    internal: {
      sid: 'test-session-id',
      createdAt: Date.now(),
    },
    ...overrides
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns access token when session exists', async () => {
    const mockSession = createMockSession();

    mockAuth0.getSession.mockResolvedValue(mockSession);

    const result = await getAccessToken();

    expect(mockAuth0.getSession).toHaveBeenCalled();
    expect(result).toBe('mock-access-token-123');
  });

  it('returns undefined when session does not exist', async () => {
    mockAuth0.getSession.mockResolvedValue(null);

    const result = await getAccessToken();

    expect(mockAuth0.getSession).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('returns undefined when session exists but has no tokenSet', async () => {
    const mockSession = createMockSession({ tokenSet: undefined });

    mockAuth0.getSession.mockResolvedValue(mockSession);

    const result = await getAccessToken();

    expect(mockAuth0.getSession).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('returns undefined when session exists but tokenSet has no accessToken', async () => {
    const mockSession = createMockSession({ tokenSet: {} });

    mockAuth0.getSession.mockResolvedValue(mockSession);

    const result = await getAccessToken();

    expect(mockAuth0.getSession).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
