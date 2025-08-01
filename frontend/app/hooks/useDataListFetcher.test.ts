import { renderHook, act } from '@testing-library/react';
import { useDataListFetcher } from './useDataListFetcher';

describe('useDataListFetcher', () => {
  const mockFetchItems = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useDataListFetcher(mockFetchItems, 'Test Item'));

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toEqual({ type: null, text: '' });
  });

  it('fetches items successfully', async () => {
    const mockItems = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    mockFetchItems.mockResolvedValue({ successful: true, data: mockItems });

    const { result } = renderHook(() => useDataListFetcher(mockFetchItems, 'Test Item'));

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(result.current.items).toEqual(mockItems);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toEqual({ type: null, text: '' });
  });

  it('handles fetch errors', async () => {
    const errorMessage = 'Failed to fetch items';
    mockFetchItems.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useDataListFetcher(mockFetchItems, 'Test Item'));

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toEqual({
      type: 'ERROR',
      text: 'An error occurred while loading test items. Please try again.'
    });
  });
}); 