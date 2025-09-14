import { cleanCurrencyInput } from '@/app/lib/utils';
import { holdingInvestmentReturnFormOnChange, HoldingInvestmentReturnFormData, HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '@/app/net-worth/investment-returns';

jest.mock('@/app/lib/utils', () => ({
  cleanCurrencyInput: jest.fn(),
  replaceSpacesWithDashes: jest.fn(),
}));

const mockCleanCurrencyInput = cleanCurrencyInput as jest.MockedFunction<typeof cleanCurrencyInput>;
const FORM_ID = HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;

describe('holdingInvestmentReturnFormOnChange', () => {
  let mockSetEditingFormData: jest.MockedFunction<(value: React.SetStateAction<Partial<HoldingInvestmentReturnFormData>>) => void>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetEditingFormData = jest.fn();
  });

  it('should update form data for non-currency fields', () => {
    const event = {
      target: {
        name: `${FORM_ID}-startHoldingSnapshotId`,
        value: 'new-snapshot-id',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    holdingInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    const updateFn = mockSetEditingFormData.mock.calls[0][0] as (prev: Partial<HoldingInvestmentReturnFormData>) => Partial<HoldingInvestmentReturnFormData>;
    const result = updateFn({ startHoldingSnapshotId: 'old-id' });
    expect(result).toEqual({ startHoldingSnapshotId: 'new-snapshot-id' });
  });

  it('should clean currency input for endHoldingSnapshotBalance field', () => {
    mockCleanCurrencyInput.mockReturnValue('1500.75');

    const event = {
      target: {
        name: `${FORM_ID}-endHoldingSnapshotBalance`,
        value: '1,500.75',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    holdingInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('1,500.75');
    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFn = mockSetEditingFormData.mock.calls[0][0] as (prev: Partial<HoldingInvestmentReturnFormData>) => Partial<HoldingInvestmentReturnFormData>;
    const result = updateFn({});
    expect(result).toEqual({ endHoldingSnapshotBalance: '1500.75' });
  });

  it('should clean currency input for totalContributions field', () => {
    mockCleanCurrencyInput.mockReturnValue('500.00');

    const event = {
      target: {
        name: `${FORM_ID}-totalContributions`,
        value: '500',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    holdingInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('500');
    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFn = mockSetEditingFormData.mock.calls[0][0] as (prev: Partial<HoldingInvestmentReturnFormData>) => Partial<HoldingInvestmentReturnFormData>;
    const result = updateFn({});
    expect(result).toEqual({ totalContributions: '500.00' });
  });

  it('should clean currency input for totalWithdrawals field', () => {
    mockCleanCurrencyInput.mockReturnValue('100.50');

    const event = {
      target: {
        name: `${FORM_ID}-totalWithdrawals`,
        value: '100.5',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    holdingInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('100.5');
    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFn = mockSetEditingFormData.mock.calls[0][0] as (prev: Partial<HoldingInvestmentReturnFormData>) => Partial<HoldingInvestmentReturnFormData>;
    const result = updateFn({});
    expect(result).toEqual({ totalWithdrawals: '100.50' });
  });

  it('should return early when cleanCurrencyInput returns null for currency fields', () => {
    mockCleanCurrencyInput.mockReturnValue(null);

    const event = {
      target: {
        name: `${FORM_ID}-totalContributions`,
        value: 'invalid',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    holdingInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('invalid');
    expect(mockSetEditingFormData).not.toHaveBeenCalled();
  });

  it('should preserve existing form data when updating', () => {
    const event = {
      target: {
        name: `${FORM_ID}-startHoldingSnapshotId`,
        value: 'new-id',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    holdingInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    const updateFn = mockSetEditingFormData.mock.calls[0][0] as (prev: Partial<HoldingInvestmentReturnFormData>) => Partial<HoldingInvestmentReturnFormData>;
    const existingData = { 
      startHoldingSnapshotId: 'old-id',
      endHoldingSnapshotId: 'existing-id',
      totalContributions: '100.00'
    };
    const result = updateFn(existingData);
    expect(result).toEqual({
      startHoldingSnapshotId: 'new-id',
      endHoldingSnapshotId: 'existing-id',
      totalContributions: '100.00'
    });
  });

  it('should handle select element events', () => {
    const event = {
      target: {
        name: `${FORM_ID}-endHoldingSnapshotId`,
        value: 'selected-snapshot-id',
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    holdingInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    const updateFn = mockSetEditingFormData.mock.calls[0][0] as (prev: Partial<HoldingInvestmentReturnFormData>) => Partial<HoldingInvestmentReturnFormData>;
    const result = updateFn({});
    expect(result).toEqual({ endHoldingSnapshotId: 'selected-snapshot-id' });
  });

  it('should extract field name correctly from prefixed input names', () => {
    const event = {
      target: {
        name: `${FORM_ID}-startHoldingSnapshotDate`,
        value: '2024-01-01',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    holdingInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    const updateFn = mockSetEditingFormData.mock.calls[0][0] as (prev: Partial<HoldingInvestmentReturnFormData>) => Partial<HoldingInvestmentReturnFormData>;
    const result = updateFn({});
    expect(result).toEqual({ startHoldingSnapshotDate: '2024-01-01' });
  });
});
