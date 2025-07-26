class MockAuth0Client {
  constructor(config) {
    this.config = config;
  }
  
  getSession = jest.fn();
  getAccessToken = jest.fn();
  withApiAuthRequired = jest.fn((handler) => handler);
  withPageAuthRequired = jest.fn((handler) => handler);
  getLoginUrl = jest.fn();
  getLogoutUrl = jest.fn();
  handleLogin = jest.fn();
  handleLogout = jest.fn();
  handleCallback = jest.fn();
  handleProfile = jest.fn();
  requireAuthentication = jest.fn();
}

module.exports = {
  Auth0Client: MockAuth0Client,
  getSession: jest.fn(),
  getAccessToken: jest.fn(),
  withApiAuthRequired: jest.fn((handler) => handler),
  withPageAuthRequired: jest.fn((handler) => handler),
  getLoginUrl: jest.fn(),
  getLogoutUrl: jest.fn(),
  handleLogin: jest.fn(),
  handleLogout: jest.fn(),
  handleCallback: jest.fn(),
  handleProfile: jest.fn(),
  requireAuthentication: jest.fn(),
  initAuth0: jest.fn(),
}; 