import { auth0 } from '@/app/lib/auth';

describe('auth0', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('initializes with environment variables set', () => {
    process.env.AUTH0_DOMAIN = 'test.auth0.com';
    process.env.AUTH0_CLIENT_ID = 'test-client-id';
    process.env.AUTH0_CLIENT_SECRET = 'test-client-secret';
    process.env.AUTH0_SECRET = 'test-secret';
    process.env.AUTH0_SCOPE = 'openid profile email';
    process.env.AUTH0_AUDIENCE = 'test-audience';

    // Re-import to trigger the console.log statements
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('..');

    expect(auth0).toBeDefined();
  });

  it('initializes with environment variables not set', () => {
    delete process.env.AUTH0_DOMAIN;
    delete process.env.AUTH0_CLIENT_ID;
    delete process.env.AUTH0_CLIENT_SECRET;
    delete process.env.AUTH0_SECRET;
    delete process.env.AUTH0_SCOPE;
    delete process.env.AUTH0_AUDIENCE;

    // Re-import to trigger the console.log statements
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('..');

    expect(auth0).toBeDefined();
  });

  it('initializes with mixed environment variables', () => {
    process.env.AUTH0_DOMAIN = 'test.auth0.com';
    process.env.AUTH0_CLIENT_ID = 'test-client-id';
    delete process.env.AUTH0_CLIENT_SECRET;
    delete process.env.AUTH0_SECRET;
    process.env.AUTH0_SCOPE = 'openid profile';
    delete process.env.AUTH0_AUDIENCE;

    // Re-import to trigger the console.log statements
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('..');

    expect(auth0).toBeDefined();
  });
});
