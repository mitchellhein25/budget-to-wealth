import { getAccessToken } from '../getAccessToken';
import { auth0 } from '../auth0';

jest.mock('../auth0');

const mockAuth0 = auth0 as jest.Mocked<typeof auth0>;

describe('getAccessToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns access token when session exists', async () => {
    const mockSession = {
      tokenSet: {
        accessToken: 'mock-access-token-123'
      }
    };

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
    const mockSession = { tokenSet: undefined };

    mockAuth0.getSession.mockResolvedValue(mockSession);

    const result = await getAccessToken();

    expect(mockAuth0.getSession).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('returns undefined when session exists but tokenSet has no accessToken', async () => {
    const mockSession = {
      tokenSet: {}
    };

    mockAuth0.getSession.mockResolvedValue(mockSession);

    const result = await getAccessToken();

    expect(mockAuth0.getSession).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
