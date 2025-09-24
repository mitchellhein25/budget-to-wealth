import { renderHook, act } from '@testing-library/react';
import { useFormListItemsFetch } from '@/app/hooks/useFormListItemsFetch';
import { MessageType } from '@/app/lib/utils';
import { FetchResult } from '@/app/lib/api';

const mockFetchItems = jest.fn();
const mockArgs = {
  fetchItems: mockFetchItems,
  itemName: 'item',
};

describe('useFormListItemsFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useFormListItemsFetch(mockArgs));

    expect(result.current.isPending).toBe(false);
    expect(result.current.items).toEqual([]);
    expect(result.current.message).toEqual({ type: null, text: '' });
    expect(typeof result.current.fetchItems).toBe('function');
  });

  it('handles successful fetch', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    const mockResponse: FetchResult<typeof mockData> = {
      successful: true,
      data: mockData,
      responseMessage: 'Items fetched successfully',
    };
    mockFetchItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFormListItemsFetch(mockArgs));

    await act(async () => {
      result.current.fetchItems();
    });

    expect(result.current.items).toEqual(mockData);
    expect(result.current.message).toEqual({ type: null, text: '' });
    expect(mockFetchItems).toHaveBeenCalledTimes(1);
  });

  it('handles failed fetch with unsuccessful response', async () => {
    const mockResponse: FetchResult<unknown[]> = {
      successful: false,
      data: [],
      responseMessage: 'Items fetched successfully',
    };
    mockFetchItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFormListItemsFetch(mockArgs));

    await act(async () => {
      result.current.fetchItems();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.message).toEqual({
      type: MessageType.ERROR,
      text: 'Failed to load items. Please try again.',
    });
    expect(mockFetchItems).toHaveBeenCalledTimes(1);
  });

  it('handles fetch error with exception', async () => {
    mockFetchItems.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFormListItemsFetch(mockArgs));

    await act(async () => {
      result.current.fetchItems();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.message).toEqual({
      type: MessageType.ERROR,
      text: 'An error occurred while loading items. Please try again.',
    });
    expect(mockFetchItems).toHaveBeenCalledTimes(1);
  });

  it('clears message before starting new fetch', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }];
    const mockResponse: FetchResult<typeof mockData> = {
      successful: true,
      data: mockData,
      responseMessage: 'Items fetched successfully',
    };
    mockFetchItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFormListItemsFetch(mockArgs));

    // First set an error message
    await act(async () => {
      result.current.fetchItems();
    });

    // Verify message is cleared and then set
    expect(result.current.message).toEqual({ type: null, text: '' });
  });

  it('uses correct item name in error messages', async () => {
    const customArgs = {
      fetchItems: mockFetchItems,
      itemName: 'budget',
    };
    const mockResponse: FetchResult<unknown[]> = {
      successful: false,
      data: [],
      responseMessage: 'Items fetched successfully',
    };
    mockFetchItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFormListItemsFetch(customArgs));

    await act(async () => {
      result.current.fetchItems();
    });

    expect(result.current.message).toEqual({
      type: MessageType.ERROR,
      text: 'Failed to load budgets. Please try again.',
    });
  });

  it('handles multiple sequential fetches', async () => {
    const mockData1 = [{ id: 1, name: 'Item 1' }];
    const mockData2 = [{ id: 2, name: 'Item 2' }];
    const mockResponse1: FetchResult<typeof mockData1> = {
      successful: true,
      data: mockData1,
      responseMessage: 'Items fetched successfully',
    };
    const mockResponse2: FetchResult<typeof mockData2> = {
      successful: true,
      data: mockData2,
      responseMessage: 'Items fetched successfully',
    };
    
    mockFetchItems
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { result } = renderHook(() => useFormListItemsFetch(mockArgs));

    await act(async () => {
      result.current.fetchItems();
    });

    expect(result.current.items).toEqual(mockData1);

    await act(async () => {
      result.current.fetchItems();
    });

    expect(result.current.items).toEqual(mockData2);
    expect(mockFetchItems).toHaveBeenCalledTimes(2);
  });

  it('handles empty data response', async () => {
    const mockResponse: FetchResult<unknown[]> = {
      successful: true,
      data: [],
      responseMessage: 'Items fetched successfully',
    };
    mockFetchItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFormListItemsFetch(mockArgs));

    await act(async () => {
      result.current.fetchItems();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.message).toEqual({ type: null, text: '' });
  });

  it('handles null data response', async () => {
    const mockResponse: FetchResult<unknown[]> = {
      successful: true,
      data: null as unknown[] | null,
      responseMessage: 'Items fetched successfully',
    };
    mockFetchItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFormListItemsFetch(mockArgs));

    await act(async () => {
      result.current.fetchItems();
    });

    expect(result.current.items).toEqual(null);
    expect(result.current.message).toEqual({ type: null, text: '' });
  });
});
