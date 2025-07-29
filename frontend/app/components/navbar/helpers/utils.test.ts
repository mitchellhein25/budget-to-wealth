import { isTokenExpired, isAuthenticated, closeDrawer, navItems } from './utils';
import { SessionData } from '@auth0/nextjs-auth0/types';

describe('utils', () => {
  describe('isTokenExpired', () => {
    it('returns true when token is expired', () => {
      const expiredSession: SessionData = {
        user: { name: 'Test User', email: 'test@example.com', sub: 'test-id' },
        tokenSet: {
          accessToken: 'test-token',
          expiresAt: Date.now() / 1000 - 3600, // 1 hour ago
        },
        internal: { sid: 'test-session', createdAt: Date.now() },
      };

      expect(isTokenExpired(expiredSession)).toBe(true);
    });

    it('returns false when token is not expired', () => {
      const validSession: SessionData = {
        user: { name: 'Test User', email: 'test@example.com', sub: 'test-id' },
        tokenSet: {
          accessToken: 'test-token',
          expiresAt: Date.now() / 1000 + 3600, // 1 hour from now
        },
        internal: { sid: 'test-session', createdAt: Date.now() },
      };

      expect(isTokenExpired(validSession)).toBe(false);
    });

    it('returns false when session has no tokenSet', () => {
      const sessionWithoutToken = {
        user: { name: 'Test User', email: 'test@example.com', sub: 'test-id' },
        tokenSet: undefined,
        internal: { sid: 'test-session', createdAt: Date.now() },
      } as unknown as SessionData;

      expect(isTokenExpired(sessionWithoutToken)).toBe(false);
    });

    it('returns false when tokenSet has no expiresAt', () => {
      const sessionWithoutExpiry = {
        user: { name: 'Test User', email: 'test@example.com', sub: 'test-id' },
        tokenSet: {
          accessToken: 'test-token',
          expiresAt: undefined,
        },
        internal: { sid: 'test-session', createdAt: Date.now() },
      } as unknown as SessionData;

      expect(isTokenExpired(sessionWithoutExpiry)).toBe(false);
    });

    it('returns false when session is null', () => {
      expect(isTokenExpired(null)).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('returns true for valid session with non-expired token', () => {
      const validSession: SessionData = {
        user: { name: 'Test User', email: 'test@example.com', sub: 'test-id' },
        tokenSet: {
          accessToken: 'test-token',
          expiresAt: Date.now() / 1000 + 3600,
        },
        internal: { sid: 'test-session', createdAt: Date.now() },
      };

      expect(isAuthenticated(validSession)).toBe(true);
    });

    it('returns false for null session', () => {
      expect(isAuthenticated(null)).toBe(false);
    });

    it('returns false for session with expired token', () => {
      const expiredSession: SessionData = {
        user: { name: 'Test User', email: 'test@example.com', sub: 'test-id' },
        tokenSet: {
          accessToken: 'test-token',
          expiresAt: Date.now() / 1000 - 3600,
        },
        internal: { sid: 'test-session', createdAt: Date.now() },
      };

      expect(isAuthenticated(expiredSession)).toBe(false);
    });

    it('returns false for session without tokenSet', () => {
      const sessionWithoutToken = {
        user: { name: 'Test User', email: 'test@example.com', sub: 'test-id' },
        tokenSet: undefined,
        internal: { sid: 'test-session', createdAt: Date.now() },
      } as unknown as SessionData;

      expect(isAuthenticated(sessionWithoutToken)).toBe(true);
    });
  });

  describe('closeDrawer', () => {
    let mockGetElementById: jest.SpyInstance;

    beforeEach(() => {
      mockGetElementById = jest.spyOn(document, 'getElementById');
    });

    afterEach(() => {
      mockGetElementById.mockRestore();
    });

    it('unchecks the drawer checkbox when element exists', () => {
      const mockCheckbox = {
        checked: true,
      } as HTMLInputElement;

      mockGetElementById.mockReturnValue(mockCheckbox);

      closeDrawer();

      expect(mockGetElementById).toHaveBeenCalledWith('mobile-drawer');
      expect(mockCheckbox.checked).toBe(false);
    });

    it('does not throw error when element does not exist', () => {
      mockGetElementById.mockReturnValue(null);

      expect(() => closeDrawer()).not.toThrow();
      expect(mockGetElementById).toHaveBeenCalledWith('mobile-drawer');
    });

    it('does not throw error when element is not an input', () => {
      const mockElement = document.createElement('div');
      mockGetElementById.mockReturnValue(mockElement as any);

      expect(() => closeDrawer()).not.toThrow();
      expect(mockGetElementById).toHaveBeenCalledWith('mobile-drawer');
    });
  });

  describe('navItems', () => {
    it('contains the expected navigation items', () => {
      expect(navItems).toHaveLength(3);
    });

    it('has correct structure for each navigation item', () => {
      navItems.forEach(item => {
        expect(item).toHaveProperty('href');
        expect(item).toHaveProperty('label');
        expect(typeof item.href).toBe('string');
        expect(typeof item.label).toBe('string');
      });
    });

    it('has cash flow as first navigation item', () => {
      const cashFlowItem = navItems[0];
      expect(cashFlowItem.href).toContain('/cashflow/expenses');
      expect(cashFlowItem.label).toBe('Cashflow');
    });

    it('has net worth as second navigation item', () => {
      const netWorthItem = navItems[1];
      expect(netWorthItem.href).toContain('/net-worth');
      expect(netWorthItem.label).toBe('Net Worth');
    });

    it('has dashboards as third navigation item', () => {
      const dashboardsItem = navItems[2];
      expect(dashboardsItem.href).toContain('/dashboards');
      expect(dashboardsItem.label).toBe('Dashboards');
    });
  });
}); 