import { renderHook, act } from '@testing-library/react';
import { useDataListFetcher } from './useDataListFetcher';
import { GetRequestResultList } from '@/app/lib/api/rest-methods/getRequest';
import { MESSAGE_TYPE_ERROR } from '@/app/components/Utils';

const TEST_ITEM_NAME = 'TestItem';
const SUCCESS_MESSAGE = 'Success';
const ERROR_MESSAGE = 'Error occurred';

interface TestItem {
  id: number;
  name: string;
}

const mockFetchFunction = jest.fn();
const mockSuccessfulResponse: GetRequestResultList<TestItem> = {
  successful: true,
  data: [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ],
  responseMessage: 'Success'
};

const mockFailedResponse: GetRequestResultList<TestItem> = {
  successful: false,
  data: [],
  responseMessage: 'Failed'
};

describe('useDataListFetcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => 
      useDataListFetcher<TestItem>(mockFetchFunction, TEST_ITEM_NAME)
    );

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toEqual({ type: null, text: '' });
    expect(typeof result.current.fetchItems).toBe('function');
    expect(typeof result.current.setMessage).toBe('function');
  });

  it('should successfully fetch items', async () => {
    mockFetchFunction.mockResolvedValue(mockSuccessfulResponse);

    const { result } = renderHook(() => 
      useDataListFetcher<TestItem>(mockFetchFunction, TEST_ITEM_NAME)
    );

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(result.current.items).toEqual(mockSuccessfulResponse.data);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toEqual({ type: null, text: '' });
    expect(mockFetchFunction).toHaveBeenCalledTimes(1);
  });

  it('should handle failed API response', async () => {
    mockFetchFunction.mockResolvedValue(mockFailedResponse);

    const { result } = renderHook(() => 
      useDataListFetcher<TestItem>(mockFetchFunction, TEST_ITEM_NAME)
    );

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toEqual({
      type: MESSAGE_TYPE_ERROR,
      text: `Failed to load ${TEST_ITEM_NAME.toLowerCase()}s. Please try again.`
    });
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Network error');
    mockFetchFunction.mockRejectedValue(error);

    const { result } = renderHook(() => 
      useDataListFetcher<TestItem>(mockFetchFunction, TEST_ITEM_NAME)
    );

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toEqual({
      type: MESSAGE_TYPE_ERROR,
      text: `An error occurred while loading ${TEST_ITEM_NAME.toLowerCase()}s. Please try again.`
    });
    expect(console.error).toHaveBeenCalledWith('Fetch error:', error);
  });

  it('should set loading state during fetch', async () => {
    let resolvePromise: (value: GetRequestResultList<TestItem>) => void;
    const promise = new Promise<GetRequestResultList<TestItem>>(resolve => {
      resolvePromise = resolve;
    });
    mockFetchFunction.mockReturnValue(promise);

    const { result } = renderHook(() => 
      useDataListFetcher<TestItem>(mockFetchFunction, TEST_ITEM_NAME)
    );

    act(() => {
      result.current.fetchItems();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.message).toEqual({ type: null, text: '' });

    await act(async () => {
      resolvePromise!(mockSuccessfulResponse);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should clear message on successful fetch', async () => {
    mockFetchFunction.mockResolvedValue(mockSuccessfulResponse);

    const { result } = renderHook(() => 
      useDataListFetcher<TestItem>(mockFetchFunction, TEST_ITEM_NAME)
    );

    act(() => {
      result.current.setMessage({ type: MESSAGE_TYPE_ERROR, text: 'Previous error' });
    });

    expect(result.current.message).toEqual({ type: MESSAGE_TYPE_ERROR, text: 'Previous error' });

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(result.current.message).toEqual({ type: null, text: '' });
  });

  it('should allow setting custom messages', () => {
    const { result } = renderHook(() => 
      useDataListFetcher<TestItem>(mockFetchFunction, TEST_ITEM_NAME)
    );

    const customMessage = { type: 'ERROR' as const, text: 'Custom error message' };

    act(() => {
      result.current.setMessage(customMessage);
    });

    expect(result.current.message).toEqual(customMessage);
  });

  it('should maintain items state when fetch fails', async () => {
    mockFetchFunction.mockResolvedValue(mockFailedResponse);

    const { result } = renderHook(() => 
      useDataListFetcher<TestItem>(mockFetchFunction, TEST_ITEM_NAME)
    );

    await act(async () => {
      await result.current.fetchItems();
    });

    expect(result.current.items).toEqual([]);
  });
}); 