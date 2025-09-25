import { renderHook, act } from '@testing-library/react';
import { useDeleteConfirmation } from '@/app/hooks/useDeleteConfirmation';
import { FetchResult } from '@/app/lib/api';

const mockDeleteFunction = jest.fn();
const mockOnSuccess = jest.fn();

const successfulResult: FetchResult<unknown> = {
  successful: true,
  data: { id: 1, name: 'test' },
  responseMessage: 'Success'
};

const failedResult: FetchResult<unknown> = {
  successful: false,
  data: null,
  responseMessage: 'Delete failed'
};

const testId = 123;

describe('useDeleteConfirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns initial state values', () => {
    const { result } = renderHook(() =>
      useDeleteConfirmation({
        deleteFunction: mockDeleteFunction,
        onSuccess: mockOnSuccess
      })
    );

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('opens delete modal and sets item ID', () => {
    const { result } = renderHook(() =>
      useDeleteConfirmation({
        deleteFunction: mockDeleteFunction,
        onSuccess: mockOnSuccess
      })
    );

    act(() => {
      result.current.openDeleteModal(testId);
    });

    expect(result.current.isModalOpen).toBe(true);
  });

  it('closes delete modal and resets state', () => {
    const { result } = renderHook(() =>
      useDeleteConfirmation({
        deleteFunction: mockDeleteFunction,
        onSuccess: mockOnSuccess
      })
    );

    act(() => {
      result.current.openDeleteModal(testId);
    });

    act(() => {
      result.current.closeDeleteModal();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles successful deletion', async () => {
    mockDeleteFunction.mockResolvedValue(successfulResult);

    const { result } = renderHook(() =>
      useDeleteConfirmation({
        deleteFunction: mockDeleteFunction,
        onSuccess: mockOnSuccess
      })
    );

    act(() => {
      result.current.openDeleteModal(testId);
    });

    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(mockDeleteFunction).toHaveBeenCalledWith(testId);
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles failed deletion', async () => {
    mockDeleteFunction.mockResolvedValue(failedResult);

    const { result } = renderHook(() =>
      useDeleteConfirmation({
        deleteFunction: mockDeleteFunction,
        onSuccess: mockOnSuccess
      })
    );

    act(() => {
      result.current.openDeleteModal(testId);
    });

    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(mockDeleteFunction).toHaveBeenCalledWith(testId);
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles deletion when itemToDelete is null', async () => {
    const { result } = renderHook(() =>
      useDeleteConfirmation({
        deleteFunction: mockDeleteFunction,
        onSuccess: mockOnSuccess
      })
    );

    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(mockDeleteFunction).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('sets loading state during deletion', async () => {
    let resolvePromise: (value: FetchResult<unknown>) => void;
    const deletePromise = new Promise<FetchResult<unknown>>((resolve) => {
      resolvePromise = resolve;
    });
    mockDeleteFunction.mockReturnValue(deletePromise);

    const { result } = renderHook(() =>
      useDeleteConfirmation({
        deleteFunction: mockDeleteFunction,
        onSuccess: mockOnSuccess
      })
    );

    act(() => {
      result.current.openDeleteModal(testId);
    });

    act(() => {
      result.current.confirmDelete();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise!(successfulResult);
      await deletePromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('handles delete function throwing an error', async () => {
    const error = new Error('Network error');
    mockDeleteFunction.mockRejectedValue(error);

    const { result } = renderHook(() =>
      useDeleteConfirmation({
        deleteFunction: mockDeleteFunction,
        onSuccess: mockOnSuccess
      })
    );

    act(() => {
      result.current.openDeleteModal(testId);
    });

    await act(async () => {
      try {
        await result.current.confirmDelete();
      } catch {
        // Expected error, ignore it
      }
    });

    expect(mockDeleteFunction).toHaveBeenCalledWith(testId);
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
