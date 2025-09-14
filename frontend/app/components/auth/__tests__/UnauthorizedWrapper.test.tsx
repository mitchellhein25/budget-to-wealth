import React from 'react';
import { render, screen } from '@testing-library/react';
import { UnauthorizedWrapper } from '@/app/components/auth/UnauthorizedWrapper';
import { SessionData } from '@auth0/nextjs-auth0/types';

jest.mock('@/app/lib/auth', () => ({
  unauthorized: jest.fn(),
}));

describe('UnauthorizedWrapper', () => {
  const mockUnauthorized = jest.requireMock('@/app/lib/auth').unauthorized;
  const mockChildren = <div data-testid="children">Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when unauthorized returns null', () => {
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={null}>
        {mockChildren}
      </UnauthorizedWrapper>
    );

    expect(screen.getByTestId('children')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders unauthorized component when unauthorized returns JSX', () => {
    const unauthorizedComponent = (
      <div data-testid="unauthorized-component">
        <h2>Access Restricted</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
    mockUnauthorized.mockReturnValue(unauthorizedComponent);
    
    render(
      <UnauthorizedWrapper session={null}>
        {mockChildren}
      </UnauthorizedWrapper>
    );

    expect(screen.getByTestId('unauthorized-component')).toBeInTheDocument();
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.getByText('Please log in to access this page.')).toBeInTheDocument();
    expect(screen.queryByTestId('children')).not.toBeInTheDocument();
  });

  it('calls unauthorized function with session prop', () => {
    const mockSession: SessionData = {
      user: { sub: 'test-user' },
      tokenSet: { accessToken: 'test-token', expiresAt: Math.floor(Date.now() / 1000) + 3600 },
      internal: { sid: 'test-session', createdAt: Date.now() }
    };
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={mockSession}>
        {mockChildren}
      </UnauthorizedWrapper>
    );

    expect(mockUnauthorized).toHaveBeenCalledWith(mockSession);
    expect(mockUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('calls unauthorized function with null session', () => {
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={null}>
        {mockChildren}
      </UnauthorizedWrapper>
    );

    expect(mockUnauthorized).toHaveBeenCalledWith(null);
    expect(mockUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('handles undefined session', () => {
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={undefined as unknown as SessionData}>
        {mockChildren}
      </UnauthorizedWrapper>
    );

    expect(mockUnauthorized).toHaveBeenCalledWith(undefined);
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('handles empty children', () => {
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={null}>
        {null}
      </UnauthorizedWrapper>
    );

    expect(mockUnauthorized).toHaveBeenCalledWith(null);
  });

  it('handles multiple children', () => {
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={null}>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </UnauthorizedWrapper>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  it('handles string children', () => {
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={null}>
        Simple text content
      </UnauthorizedWrapper>
    );

    expect(screen.getByText('Simple text content')).toBeInTheDocument();
  });

  it('handles number children', () => {
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={null}>
        {42}
      </UnauthorizedWrapper>
    );

    expect(screen.getByText('42')).toBeInTheDocument();
  });


  it('handles array children', () => {
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={null}>
        {[<div key="1">Item 1</div>, <div key="2">Item 2</div>]}
      </UnauthorizedWrapper>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('handles fragment children', () => {
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={null}>
        <>
          <div data-testid="fragment-child">Fragment Child</div>
        </>
      </UnauthorizedWrapper>
    );

    expect(screen.getByTestId('fragment-child')).toBeInTheDocument();
  });

  it('handles complex session object', () => {
    const complexSession: SessionData = {
      user: { 
        sub: 'test-user',
        name: 'Test User',
        email: 'test@example.com'
      },
      tokenSet: { 
        accessToken: 'test-token',
        idToken: 'test-id-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Math.floor(Date.now() / 1000) + 3600
      },
      internal: { sid: 'test-session', createdAt: Date.now() }
    };
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={complexSession}>
        {mockChildren}
      </UnauthorizedWrapper>
    );

    expect(mockUnauthorized).toHaveBeenCalledWith(complexSession);
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('handles session with minimal data', () => {
    const minimalSession: SessionData = {
      user: { sub: 'test-user' },
      tokenSet: { accessToken: 'test-token', expiresAt: Math.floor(Date.now() / 1000) + 3600 },
      internal: { sid: 'test-session', createdAt: Date.now() }
    };
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={minimalSession}>
        {mockChildren}
      </UnauthorizedWrapper>
    );

    expect(mockUnauthorized).toHaveBeenCalledWith(minimalSession);
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('handles session with only tokenSet', () => {
    const tokenOnlySession: SessionData = {
      user: { sub: 'test-user' },
      tokenSet: { accessToken: 'test-token', 
      expiresAt: Math.floor(Date.now() / 1000) + 3600 },
      internal: { sid: 'test-session', createdAt: Date.now() }
    };
    mockUnauthorized.mockReturnValue(null);
    
    render(
      <UnauthorizedWrapper session={tokenOnlySession}>
        {mockChildren}
      </UnauthorizedWrapper>
    );

    expect(mockUnauthorized).toHaveBeenCalledWith(tokenOnlySession);
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });
});
