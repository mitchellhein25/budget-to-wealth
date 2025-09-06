import { NetWorthTrendGraphData, NetWorthTrendDatasets } from '@/app/dashboards/net-worth';

const assetItemNamePlural = 'Assets';
const debtItemNamePlural = 'Debts';
const netWorthItemName = 'Net Worth';

describe('NetWorthTrendDatasets', () => {
  it('returns empty array when data is null', () => {
    const result = NetWorthTrendDatasets(null);
    expect(result).toEqual([]);
  });

  it('returns empty array when data entries is null', () => {
    const data = null;
    const result = NetWorthTrendDatasets(data);
    expect(result).toEqual([]);
  });

  it('returns correct datasets when data is valid', () => {
    const data: NetWorthTrendGraphData = {
      entries: [
        {
          date: '2024-01-01',
          assetValueInCents: 1000000,
          debtValueInCents: 300000,
          netWorthInCents: 700000,
        },
        {
          date: '2024-01-02',
          assetValueInCents: 1200000,
          debtValueInCents: 250000,
          netWorthInCents: 950000,
        },
      ],
    };

    const result = NetWorthTrendDatasets(data);

    expect(result).toHaveLength(3);
    
    expect(result[0]).toEqual({
      type: 'line',
      label: assetItemNamePlural,
      data: [10000, 12000],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
    });

    expect(result[1]).toEqual({
      type: 'line',
      label: debtItemNamePlural,
      data: [3000, 2500],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
    });

    expect(result[2]).toEqual({
      type: 'line',
      label: netWorthItemName,
      data: [7000, 9500],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246)',
    });
  });

  it('handles zero values correctly', () => {
    const data: NetWorthTrendGraphData = {
      entries: [
        {
          date: '2024-01-01',
          assetValueInCents: 0,
          debtValueInCents: 0,
          netWorthInCents: 0,
        },
      ],
    };

    const result = NetWorthTrendDatasets(data);

    expect(result[0].data).toEqual([0]);
    expect(result[1].data).toEqual([0]);
    expect(result[2].data).toEqual([0]);
  });

  it('handles negative net worth', () => {
    const data: NetWorthTrendGraphData = {
      entries: [
        {
          date: '2024-01-01',
          assetValueInCents: 500000,
          debtValueInCents: 1000000,
          netWorthInCents: -500000,
        },
      ],
    };

    const result = NetWorthTrendDatasets(data);

    expect(result[2].data).toEqual([-5000]);
  });

  it('converts cents to dollars correctly', () => {
    const data: NetWorthTrendGraphData = {
      entries: [
        {
          date: '2024-01-01',
          assetValueInCents: 123456,
          debtValueInCents: 78901,
          netWorthInCents: 44555,
        },
      ],
    };

    const result = NetWorthTrendDatasets(data);

    expect(result[0].data).toEqual([1234.56]);
    expect(result[1].data).toEqual([789.01]);
    expect(result[2].data).toEqual([445.55]);
  });

  it('handles large values correctly', () => {
    const data: NetWorthTrendGraphData = {
      entries: [
        {
          date: '2024-01-01',
          assetValueInCents: 999999999,
          debtValueInCents: 123456789,
          netWorthInCents: 876543210,
        },
      ],
    };

    const result = NetWorthTrendDatasets(data);

    expect(result[0].data).toEqual([9999999.99]);
    expect(result[1].data).toEqual([1234567.89]);
    expect(result[2].data).toEqual([8765432.10]);
  });
});
