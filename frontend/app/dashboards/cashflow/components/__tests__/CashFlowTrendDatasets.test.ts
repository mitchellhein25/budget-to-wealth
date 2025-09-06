import { CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow';
import { CashFlowTrendGraphData, CashFlowTrendDatasets } from '@/app/dashboards/cashflow';

describe('CashFlowTrendDatasets', () => {
  it('returns empty array when data is null', () => {
    const result = CashFlowTrendDatasets(null);
    expect(result).toEqual([]);
  });

  it('returns empty array when data entries is null', () => {
    const data = null;
    const result = CashFlowTrendDatasets(data);
    expect(result).toEqual([]);
  });

  it('returns correct datasets when data is valid', () => {
    const data: CashFlowTrendGraphData = {
      entries: [
        {
          date: '2024-01-01',
          incomeInCents: 100000,
          expensesInCents: 50000,
          netCashFlowInCents: 50000,
        },
        {
          date: '2024-01-02',
          incomeInCents: 200000,
          expensesInCents: 75000,
          netCashFlowInCents: 125000,
        },
      ],
    };

    const result = CashFlowTrendDatasets(data);

    expect(result).toHaveLength(3);
    
    expect(result[0]).toEqual({
      type: 'bar',
      label: INCOME_ITEM_NAME,
      data: [1000, 2000],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
    });

    expect(result[1]).toEqual({
      type: 'bar',
      label: EXPENSE_ITEM_NAME_PLURAL,
      data: [-500, -750],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
    });

    expect(result[2]).toEqual({
      type: 'line',
      label: `Net ${CASHFLOW_ITEM_NAME}`,
      data: [500, 1250],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    });
  });

  it('handles zero values correctly', () => {
    const data: CashFlowTrendGraphData = {
      entries: [
        {
          date: '2024-01-01',
          incomeInCents: 0,
          expensesInCents: 0,
          netCashFlowInCents: 0,
        },
      ],
    };

    const result = CashFlowTrendDatasets(data);

    expect(result[0].data).toEqual([0]);
    expect(result[1].data).toEqual([-0]);
    expect(result[2].data).toEqual([0]);
  });

  it('handles negative net cash flow', () => {
    const data: CashFlowTrendGraphData = {
      entries: [
        {
          date: '2024-01-01',
          incomeInCents: 50000,
          expensesInCents: 100000,
          netCashFlowInCents: -50000,
        },
      ],
    };

    const result = CashFlowTrendDatasets(data);

    expect(result[2].data).toEqual([-500]);
  });

  it('converts cents to dollars correctly', () => {
    const data: CashFlowTrendGraphData = {
      entries: [
        {
          date: '2024-01-01',
          incomeInCents: 12345,
          expensesInCents: 67890,
          netCashFlowInCents: -55545,
        },
      ],
    };

    const result = CashFlowTrendDatasets(data);

    expect(result[0].data).toEqual([123.45]);
    expect(result[1].data).toEqual([-678.90]);
    expect(result[2].data).toEqual([-555.45]);
  });
});
