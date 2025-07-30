import { renderHook } from '@testing-library/react';
import { useParentPath } from './useParentPath';

const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname()
}));

describe('useParentPath', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return root path when at root level', () => {
    mockUsePathname.mockReturnValue('/');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/');
  });

  it('should return parent path for single level path', () => {
    mockUsePathname.mockReturnValue('/cashflow');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/');
  });

  it('should return parent path for multi-level path', () => {
    mockUsePathname.mockReturnValue('/cashflow/expenses');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cashflow');
  });

  it('should return parent path for deep nested path', () => {
    mockUsePathname.mockReturnValue('/cashflow/expenses/income-categories');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cashflow/expenses');
  });

  it('should handle path with trailing slash', () => {
    mockUsePathname.mockReturnValue('/cashflow/expenses/');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cashflow');
  });

  it('should handle path with multiple trailing slashes', () => {
    mockUsePathname.mockReturnValue('/cashflow/expenses///');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cashflow');
  });

  it('should handle path with spaces and special characters', () => {
    mockUsePathname.mockReturnValue('/net-worth/holdings/holding-categories');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/net-worth/holdings');
  });

  it('should handle empty path', () => {
    mockUsePathname.mockReturnValue('');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/');
  });

  it('should handle path with only slashes', () => {
    mockUsePathname.mockReturnValue('///');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/');
  });

  it('should handle path with query parameters', () => {
    mockUsePathname.mockReturnValue('/cashflow/expenses?filter=active');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cashflow');
  });

  it('should handle path with hash fragments', () => {
    mockUsePathname.mockReturnValue('/cashflow/expenses#section');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cashflow');
  });

  it('should handle path with both query parameters and hash fragments', () => {
    mockUsePathname.mockReturnValue('/cashflow/expenses?filter=active#section');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cashflow');
  });

  it('should handle path with dynamic segments', () => {
    mockUsePathname.mockReturnValue('/cashflow/expenses/[id]/edit');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cashflow/expenses/[id]');
  });

  it('should handle path with numbers and special characters', () => {
    mockUsePathname.mockReturnValue('/cashflow/expenses/123-abc/edit');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cashflow/expenses/123-abc');
  });

  it('should handle path with underscores and hyphens', () => {
    mockUsePathname.mockReturnValue('/cash_flow/expense_categories/income-categories');

    const { result } = renderHook(() => useParentPath());

    expect(result.current).toBe('/cash_flow/expense_categories');
  });
}); 