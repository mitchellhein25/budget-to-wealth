import { transformFormDataToHoldingInvestmentReturn, HoldingInvestmentReturn } from '@/app/net-worth/investment-returns';

jest.mock('../getHoldingInvestmentReturnValidationResult', () => ({
  getHoldingInvestmentReturnValidationResult: jest.fn(),
}));

jest.mock('@/app/components/Utils', () => ({
  convertDollarsToCents: jest.fn(),
  replaceSpacesWithDashes: jest.fn((str) => str.replace(/\s+/g, '-')),
}));

const mockGetHoldingInvestmentReturnValidationResult = jest.requireMock('../getHoldingInvestmentReturnValidationResult').getHoldingInvestmentReturnValidationResult;
const mockConvertDollarsToCents = jest.requireMock('@/app/components/Utils').convertDollarsToCents;

const FORM_ID = 'holding-investment-return';

type MockValidationSuccess = {
  success: true;
  data: {
    startHoldingSnapshotId: string;
    endHoldingSnapshotId: string;
    totalContributions: string;
    totalWithdrawals: string;
  };
};

type MockValidationError = {
  success: false;
  error: { errors: Array<{ message: string }> };
};

describe('transformFormDataToHoldingInvestmentReturn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transform valid form data successfully', () => {
    const mockValidationData = {
      startHoldingSnapshotId: 'start-snapshot-id',
      endHoldingSnapshotId: 'end-snapshot-id',
      totalContributions: '500.00',
      totalWithdrawals: '100.00',
    };

    mockGetHoldingInvestmentReturnValidationResult.mockReturnValue({
      success: true,
      data: mockValidationData,
    } as MockValidationSuccess);

    mockConvertDollarsToCents
      .mockReturnValueOnce(50000)
      .mockReturnValueOnce(10000);

    const formData = new FormData();
    formData.set(`${FORM_ID}-endHoldingSnapshotId`, 'end-snapshot-id');

    const result = transformFormDataToHoldingInvestmentReturn(formData);

    expect(result.errors).toHaveLength(0);
    expect(result.item).toEqual({
      startHoldingSnapshotId: 'start-snapshot-id',
      endHoldingSnapshotId: 'end-snapshot-id',
      totalContributions: 50000,
      totalWithdrawals: 10000,
    } as HoldingInvestmentReturn);
  });

  it('should return validation errors when validation fails', () => {
    const mockValidationErrors = [
      { message: 'Start Holding Snapshot Id field is required' },
      { message: 'End Holding Snapshot Id field is required' },
    ];

    mockGetHoldingInvestmentReturnValidationResult.mockReturnValue({
      success: false,
      error: { errors: mockValidationErrors },
    } as MockValidationError);

    const formData = new FormData();
    const result = transformFormDataToHoldingInvestmentReturn(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Start Holding Snapshot Id field is required']);
  });

  it('should handle missing endHoldingSnapshotId in formData', () => {
    const mockValidationData = {
      startHoldingSnapshotId: 'start-snapshot-id',
      endHoldingSnapshotId: 'end-snapshot-id',
      totalContributions: '0',
      totalWithdrawals: '0',
    };

    mockGetHoldingInvestmentReturnValidationResult.mockReturnValue({
      success: true,
      data: mockValidationData,
    } as MockValidationSuccess);

    mockConvertDollarsToCents
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const formData = new FormData();
    formData.set(`${FORM_ID}-endHoldingSnapshotId`, '');

    const result = transformFormDataToHoldingInvestmentReturn(formData);

    expect(result.errors).toHaveLength(0);
    expect(result.item?.endHoldingSnapshotId).toBe('');
  });

  it('should convert currency values to cents', () => {
    const mockValidationData = {
      startHoldingSnapshotId: 'start-snapshot-id',
      endHoldingSnapshotId: 'end-snapshot-id',
      totalContributions: '1500.75',
      totalWithdrawals: '250.50',
    };

    mockGetHoldingInvestmentReturnValidationResult.mockReturnValue({
      success: true,
      data: mockValidationData,
    } as MockValidationSuccess);

    mockConvertDollarsToCents
      .mockReturnValueOnce(150075)
      .mockReturnValueOnce(25050);

    const formData = new FormData();
    formData.set(`${FORM_ID}-endHoldingSnapshotId`, 'end-snapshot-id');

    const result = transformFormDataToHoldingInvestmentReturn(formData);

    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('1500.75');
    expect(mockConvertDollarsToCents).toHaveBeenCalledWith('250.50');
    expect(result.item?.totalContributions).toBe(150075);
    expect(result.item?.totalWithdrawals).toBe(25050);
  });

  it('should handle null currency conversions', () => {
    const mockValidationData = {
      startHoldingSnapshotId: 'start-snapshot-id',
      endHoldingSnapshotId: 'end-snapshot-id',
      totalContributions: 'invalid',
      totalWithdrawals: 'invalid',
    };

    mockGetHoldingInvestmentReturnValidationResult.mockReturnValue({
      success: true,
      data: mockValidationData,
    } as MockValidationSuccess);

    mockConvertDollarsToCents
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    const formData = new FormData();
    formData.set(`${FORM_ID}-endHoldingSnapshotId`, 'end-snapshot-id');

    const result = transformFormDataToHoldingInvestmentReturn(formData);

    expect(result.errors).toHaveLength(0);
    expect(result.item?.totalContributions).toBe(0);
    expect(result.item?.totalWithdrawals).toBe(0);
  });

  it('should handle unexpected errors gracefully', () => {
    mockGetHoldingInvestmentReturnValidationResult.mockImplementation(() => {
      throw new Error('Unexpected database error');
    });

    const formData = new FormData();
    const result = transformFormDataToHoldingInvestmentReturn(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.\nUnexpected database error']);
  });

  it('should handle errors without message property', () => {
    mockGetHoldingInvestmentReturnValidationResult.mockImplementation(() => {
      throw 'String error';
    });

    const formData = new FormData();
    const result = transformFormDataToHoldingInvestmentReturn(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.']);
  });
});
