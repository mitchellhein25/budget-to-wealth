import { CashFlowCategory } from '@/app/cashflow/components';
import { getRequestList, FetchResult, getCategoriesList, getExpenseCategoriesList, getIncomeCategoriesList } from '@/app/lib/api';

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
  getRequestList: jest.fn(),
}));

const createMockFetchResult = <T>(data: T): FetchResult<T> => ({
  data,
  responseMessage: 'Success',
  successful: true,
});

describe('categoriesRequests', () => {
  const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategoriesList', () => {
    it('fetches categories for income type', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([
        { id: 1, name: 'Salary', categoryType: 'Income' },
        { id: 2, name: 'Freelance', categoryType: 'Income' },
      ]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getCategoriesList('Income');

      expect(mockGetRequestList).toHaveBeenCalledWith('CashFlowCategories?cashFlowType=Income');
      expect(result).toEqual(mockResponse);
    });

    it('fetches categories for expense type', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([
          { id: 1, name: 'Food', categoryType: 'Expense' },
          { id: 2, name: 'Transport', categoryType: 'Expense' },
      ]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getCategoriesList('Expense');

      expect(mockGetRequestList).toHaveBeenCalledWith('CashFlowCategories?cashFlowType=Expense');
      expect(result).toEqual(mockResponse);
    });

    it('handles failed request', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getCategoriesList('Income');

      expect(result).toEqual(mockResponse);
    });

    it('handles request error', async () => {
      const mockError = new Error('Network error');
      mockGetRequestList.mockRejectedValue(mockError);

      await expect(getCategoriesList('Income')).rejects.toThrow('Network error');
    });

    it('handles empty response data', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getCategoriesList('Income');

      expect(result).toEqual(mockResponse);
    });

    it('handles both income and expense types', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([
        { id: 1, name: 'Category 1', categoryType: 'Income' },
      ]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      await getCategoriesList('Income');
      expect(mockGetRequestList).toHaveBeenCalledWith('CashFlowCategories?cashFlowType=Income');

      mockGetRequestList.mockClear();
      await getCategoriesList('Expense');
      expect(mockGetRequestList).toHaveBeenCalledWith('CashFlowCategories?cashFlowType=Expense');
    });
  });

  describe('getExpenseCategoriesList', () => {
    it('fetches expense categories', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([
          { id: 1, name: 'Food', categoryType: 'Expense' },
          { id: 2, name: 'Transport', categoryType: 'Expense' },
          { id: 3, name: 'Entertainment', categoryType: 'Expense' },
      ]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getExpenseCategoriesList();

      expect(mockGetRequestList).toHaveBeenCalledWith('CashFlowCategories?cashFlowType=Expense');
      expect(result).toEqual(mockResponse);
    });

    it('handles failed expense categories request', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getExpenseCategoriesList();

      expect(result).toEqual(mockResponse);
    });

    it('handles expense categories request error', async () => {
      const mockError = new Error('Network error');
      mockGetRequestList.mockRejectedValue(mockError);

      await expect(getExpenseCategoriesList()).rejects.toThrow('Network error');
    });

    it('handles empty expense categories', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getExpenseCategoriesList();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getIncomeCategoriesList', () => {
    it('fetches income categories', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([
        { id: 1, name: 'Salary', categoryType: 'Income' },
        { id: 2, name: 'Freelance', categoryType: 'Income' },
        { id: 3, name: 'Investment', categoryType: 'Income' },
      ]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getIncomeCategoriesList();

      expect(mockGetRequestList).toHaveBeenCalledWith('CashFlowCategories?cashFlowType=Income');
      expect(result).toEqual(mockResponse);
    });

    it('handles failed income categories request', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getIncomeCategoriesList();

      expect(result).toEqual(mockResponse);
    });

    it('handles income categories request error', async () => {
      const mockError = new Error('Network error');
      mockGetRequestList.mockRejectedValue(mockError);

      await expect(getIncomeCategoriesList()).rejects.toThrow('Network error');
    });

    it('handles empty income categories', async () => {
      const mockResponse: FetchResult<CashFlowCategory[]> = createMockFetchResult([]);

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getIncomeCategoriesList();

      expect(result).toEqual(mockResponse);
    });
  });
}); 