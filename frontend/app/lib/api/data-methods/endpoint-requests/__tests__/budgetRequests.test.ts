import { DateRange } from "@/app/components";
import { BUDGETS_ENDPOINT, deleteRequest, FetchResult, getQueryStringForDateRange, getRequestList } from '@/app/lib/api';
import { getBudgetsByDateRange, deleteBudget } from '@/app/lib/api/data-methods/endpoint-requests/budgetRequests';

jest.mock('@/app/lib/api', () => ({
  getRequestList: jest.fn(),
  deleteRequest: jest.fn(),
  getQueryStringForDateRange: jest.fn(),
}));

const createMockFetchResult = <T>(data: T): FetchResult<T> => ({
  data,
  responseMessage: 'Success',
  successful: true,
});

describe('budgetRequests', () => {
  const mockGetRequestList = jest.mocked(getRequestList);
  const mockDeleteRequest = jest.mocked(deleteRequest);
  const mockGetQueryStringForDateRange = jest.mocked(getQueryStringForDateRange);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBudgetsByDateRange', () => {
    const mockDateRange: DateRange = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
    const mockQueryString = 'startDate=2024-01-01&endDate=2024-01-31';

    beforeEach(() => {
      mockGetQueryStringForDateRange.mockReturnValue(mockQueryString);
    });

    it('should call getRequestList with correct endpoint and query string', async () => {
      mockGetRequestList.mockResolvedValue(createMockFetchResult([]));

      await getBudgetsByDateRange(mockDateRange);

      expect(mockGetQueryStringForDateRange).toHaveBeenCalledWith(mockDateRange);
      expect(mockGetRequestList).toHaveBeenCalledWith(`${BUDGETS_ENDPOINT}?${mockQueryString}`);
    });

    it('should process budgets and set names from category names when successful', async () => {
      const mockBudgets = [
        { id: 1, amount: 1000, category: { name: 'Food' } },
        { id: 2, amount: 500, category: { name: 'Transport' } },
        { id: 3, amount: 200, category: null },
      ];
      mockGetRequestList.mockResolvedValue(createMockFetchResult(mockBudgets));

      const result = await getBudgetsByDateRange(mockDateRange);

      expect(result.successful).toBe(true);
      expect(result.data).toEqual([
        { id: 1, amount: 1000, category: { name: 'Food' }, name: 'Food' },
        { id: 2, amount: 500, category: { name: 'Transport' }, name: 'Transport' },
        { id: 3, amount: 200, category: null, name: '' },
      ]);
    });

    it('should handle empty budgets array when successful', async () => {
      mockGetRequestList.mockResolvedValue(createMockFetchResult([]));

      const result = await getBudgetsByDateRange(mockDateRange);

      expect(result.successful).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should return unsuccessful response without processing when getRequestList fails', async () => {
      mockGetRequestList.mockResolvedValue({ successful: false, data: null, responseMessage: 'Error fetching budgets' } as FetchResult<unknown[]>);

      const result = await getBudgetsByDateRange(mockDateRange);  

      expect(result.successful).toBe(false);
      expect(result.data).toBeNull();
      expect(result.responseMessage).toBe('Error fetching budgets');
    });

    it('should handle budgets with null category', async () => {
      const mockBudgets = [
        { id: 1, amount: 1000, category: null },
      ];
      const mockResponse: FetchResult<unknown> = { 
        successful: true, 
        data: mockBudgets, 
        responseMessage: 'Success' 
      };
      mockGetRequestList.mockResolvedValue(mockResponse as FetchResult<unknown[]>);

      const result = await getBudgetsByDateRange(mockDateRange);

      expect(result.successful).toBe(true);
      expect(result.data).toEqual([
        { id: 1, amount: 1000, category: null, name: '' },
      ]);
    });

    it('should handle budgets with undefined category', async () => {
      const mockBudgets = [
        { id: 1, amount: 1000, category: undefined },
      ];
      const mockResponse: FetchResult<unknown> = { 
        successful: true, 
        data: mockBudgets, 
        responseMessage: 'Success' 
      };
      mockGetRequestList.mockResolvedValue(mockResponse as FetchResult<unknown[]>);

      const result = await getBudgetsByDateRange(mockDateRange);

      expect(result.successful).toBe(true);
      expect(result.data).toEqual([
        { id: 1, amount: 1000, category: undefined, name: '' },
      ]);
    });

    it('should handle budgets with category but no name', async () => {
      const mockBudgets = [
        { id: 1, amount: 1000, category: {} },
      ];
      const mockResponse: FetchResult<unknown> = { 
        successful: true, 
        data: mockBudgets, 
        responseMessage: 'Success' 
      };
      mockGetRequestList.mockResolvedValue(mockResponse as FetchResult<unknown[]>);

      const result = await getBudgetsByDateRange(mockDateRange);

      expect(result.successful).toBe(true);
      expect(result.data).toEqual([
        { id: 1, amount: 1000, category: {}, name: '' },
      ]);
    });
  });

  describe('deleteBudget', () => {
    const mockBudgetId = 123;

    it('should call deleteRequest with correct endpoint and id', async () => {
      const mockResponse = { successful: true, data: null, responseMessage: 'Success' };
      mockDeleteRequest.mockResolvedValue(mockResponse as FetchResult<unknown>);

      await deleteBudget(mockBudgetId);

      expect(mockDeleteRequest).toHaveBeenCalledWith(BUDGETS_ENDPOINT, mockBudgetId);
    });

    it('should return successful response from deleteRequest', async () => {
      const mockResponse = { successful: true, data: null, responseMessage: 'Success' };
      mockDeleteRequest.mockResolvedValue(mockResponse as FetchResult<unknown>);

      const result = await deleteBudget(mockBudgetId);

      expect(result).toEqual(mockResponse);
    });

    it('should return unsuccessful response from deleteRequest', async () => {
      const mockResponse = { successful: false, data: null, responseMessage: 'Budget not found' };
      mockDeleteRequest.mockResolvedValue(mockResponse);

      const result = await deleteBudget(mockBudgetId);

      expect(result).toEqual(mockResponse);
    });

    it('should handle different budget ids', async () => {
      const mockResponse = { successful: true, data: null, responseMessage: 'Success' };
      mockDeleteRequest.mockResolvedValue(mockResponse);

      await deleteBudget(456);

      expect(mockDeleteRequest).toHaveBeenCalledWith(BUDGETS_ENDPOINT, 456);
    });
  });
}); 