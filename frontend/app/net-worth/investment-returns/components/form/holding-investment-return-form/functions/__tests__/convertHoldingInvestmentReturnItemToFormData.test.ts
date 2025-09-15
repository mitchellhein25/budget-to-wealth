import { convertHoldingInvestmentReturnItemToFormData } from '@/app/net-worth/investment-returns/components/form/holding-investment-return-form/functions/convertHoldingInvestmentReturnItemToFormData';
import { HoldingInvestmentReturn } from '@/app/net-worth/investment-returns';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots';

describe('convertHoldingInvestmentReturnItemToFormData', () => {
  const baseHoldingSnapshot: HoldingSnapshot = {
    id: 1,
    holdingId: 'holding-1',
    date: '2024-01-15',
    balance: 100000,
    userId: 'user-1',
  };

  const baseHoldingInvestmentReturn: HoldingInvestmentReturn = {
    id: 123,
    startHoldingSnapshotId: 'start-snapshot-1',
    startHoldingSnapshot: baseHoldingSnapshot,
    endHoldingSnapshotId: 'end-snapshot-1',
    endHoldingSnapshot: {
      ...baseHoldingSnapshot,
      id: 2,
      holdingId: 'holding-2',
      date: '2024-02-15',
      balance: 150000,
    },
    totalContributions: 50000,
    totalWithdrawals: 10000,
    returnPercentage: 20.5,
    userId: 'user-1',
    name: 'Test Investment Return',
  };

  it('converts holding investment return with all fields to form data', () => {
    const result = convertHoldingInvestmentReturnItemToFormData(baseHoldingInvestmentReturn);

    expect(result).toEqual({
      id: '123',
      startHoldingSnapshotDate: new Date('2024-01-15'),
      startHoldingSnapshotId: 'start-snapshot-1',
      endHoldingSnapshotId: 'end-snapshot-1',
      endHoldingSnapshotHoldingId: 'holding-2',
      endHoldingSnapshotDate: new Date('2024-02-15'),
      endHoldingSnapshotBalance: '1500.00',
      totalContributions: '500.00',
      totalWithdrawals: '100.00',
    });
  });

  it('converts holding investment return with undefined id', () => {
    const itemWithUndefinedId = { ...baseHoldingInvestmentReturn, id: undefined };
    const result = convertHoldingInvestmentReturnItemToFormData(itemWithUndefinedId);

    expect(result.id).toBeUndefined();
  });

  it('converts holding investment return with undefined startHoldingSnapshot', () => {
    const itemWithUndefinedStartSnapshot = { ...baseHoldingInvestmentReturn, startHoldingSnapshot: undefined };
    const result = convertHoldingInvestmentReturnItemToFormData(itemWithUndefinedStartSnapshot);

    expect(result.startHoldingSnapshotDate).toBeInstanceOf(Date);
    expect(isNaN(result.startHoldingSnapshotDate.getTime())).toBe(true);
  });

  it('converts holding investment return with undefined endHoldingSnapshot', () => {
    const itemWithUndefinedEndSnapshot = { ...baseHoldingInvestmentReturn, endHoldingSnapshot: undefined };
    const result = convertHoldingInvestmentReturnItemToFormData(itemWithUndefinedEndSnapshot);

    expect(result.endHoldingSnapshotHoldingId).toBe('');
    expect(result.endHoldingSnapshotDate).toBeInstanceOf(Date);
    expect(isNaN(result.endHoldingSnapshotDate.getTime())).toBe(true);
    expect(result.endHoldingSnapshotBalance).toBe('0.00');
  });

  it('converts holding investment return with zero amounts', () => {
    const itemWithZeroAmounts = {
      ...baseHoldingInvestmentReturn,
      endHoldingSnapshot: {
        ...baseHoldingInvestmentReturn.endHoldingSnapshot!,
        balance: 0,
      },
      totalContributions: 0,
      totalWithdrawals: 0,
    };
    const result = convertHoldingInvestmentReturnItemToFormData(itemWithZeroAmounts);

    expect(result.endHoldingSnapshotBalance).toBe('0.00');
    expect(result.totalContributions).toBe('0.00');
    expect(result.totalWithdrawals).toBe('0.00');
  });

  it('converts holding investment return with negative amounts', () => {
    const itemWithNegativeAmounts = {
      ...baseHoldingInvestmentReturn,
      endHoldingSnapshot: {
        ...baseHoldingInvestmentReturn.endHoldingSnapshot!,
        balance: -50000,
      },
      totalContributions: -10000,
      totalWithdrawals: -5000,
    };
    const result = convertHoldingInvestmentReturnItemToFormData(itemWithNegativeAmounts);

    expect(result.endHoldingSnapshotBalance).toBe('-500.00');
    expect(result.totalContributions).toBe('-100.00');
    expect(result.totalWithdrawals).toBe('-50.00');
  });

  it('converts holding investment return with large amounts', () => {
    const itemWithLargeAmounts = {
      ...baseHoldingInvestmentReturn,
      endHoldingSnapshot: {
        ...baseHoldingInvestmentReturn.endHoldingSnapshot!,
        balance: 999999999,
      },
      totalContributions: 500000000,
      totalWithdrawals: 100000000,
    };
    const result = convertHoldingInvestmentReturnItemToFormData(itemWithLargeAmounts);

    expect(result.endHoldingSnapshotBalance).toBe('9999999.99');
    expect(result.totalContributions).toBe('5000000.00');
    expect(result.totalWithdrawals).toBe('1000000.00');
  });

  it('converts holding investment return with decimal amounts', () => {
    const itemWithDecimalAmounts = {
      ...baseHoldingInvestmentReturn,
      endHoldingSnapshot: {
        ...baseHoldingInvestmentReturn.endHoldingSnapshot!,
        balance: 123456,
      },
      totalContributions: 78901,
      totalWithdrawals: 23456,
    };
    const result = convertHoldingInvestmentReturnItemToFormData(itemWithDecimalAmounts);

    expect(result.endHoldingSnapshotBalance).toBe('1234.56');
    expect(result.totalContributions).toBe('789.01');
    expect(result.totalWithdrawals).toBe('234.56');
  });

  it('converts holding investment return with minimal required fields only', () => {
    const minimalItem: HoldingInvestmentReturn = {
      startHoldingSnapshotId: 'start-snapshot-1',
      endHoldingSnapshotId: 'end-snapshot-1',
      totalContributions: 0,
      totalWithdrawals: 0,
      name: 'Test Investment Return',
    };
    const result = convertHoldingInvestmentReturnItemToFormData(minimalItem);

    expect(result.id).toBeUndefined();
    expect(result.startHoldingSnapshotDate).toBeInstanceOf(Date);
    expect(isNaN(result.startHoldingSnapshotDate.getTime())).toBe(true);
    expect(result.startHoldingSnapshotId).toBe('start-snapshot-1');
    expect(result.endHoldingSnapshotId).toBe('end-snapshot-1');
    expect(result.endHoldingSnapshotHoldingId).toBe('');
    expect(result.endHoldingSnapshotDate).toBeInstanceOf(Date);
    expect(isNaN(result.endHoldingSnapshotDate.getTime())).toBe(true);
    expect(result.endHoldingSnapshotBalance).toBe('0.00');
    expect(result.totalContributions).toBe('0.00');
    expect(result.totalWithdrawals).toBe('0.00');
  });
});
