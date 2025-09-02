import {
  BUDGETS_ENDPOINT,
  CASH_FLOW_ENTRIES_ENDPOINT,
  CASH_FLOW_CATEGORIES_ENDPOINT,
  HOLDING_SNAPSHOTS_ENDPOINT,
  HOLDINGS_ENDPOINT,
  HOLDING_CATEGORIES_ENDPOINT,
  CASH_FLOW_TREND_GRAPH_ENDPOINT,
  NET_WORTH_TREND_GRAPH_ENDPOINT,
  AVAILABLE_DATE_RANGE_ENDPOINT,
  CASH_FLOW_ENTRIES_AVAILABLE_DATE_RANGE_ENDPOINT,
  HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT,
} from '../../';

describe('API Endpoints', () => {
  it('exports all required endpoint constants', () => {
    expect(BUDGETS_ENDPOINT).toBe('Budgets');
    expect(CASH_FLOW_ENTRIES_ENDPOINT).toBe('CashFlowEntries');
    expect(CASH_FLOW_CATEGORIES_ENDPOINT).toBe('CashFlowCategories');
    expect(HOLDING_SNAPSHOTS_ENDPOINT).toBe('HoldingSnapshots');
    expect(HOLDINGS_ENDPOINT).toBe('Holdings');
    expect(HOLDING_CATEGORIES_ENDPOINT).toBe('HoldingCategories');
    expect(CASH_FLOW_TREND_GRAPH_ENDPOINT).toBe('CashFlowTrendGraph');
    expect(NET_WORTH_TREND_GRAPH_ENDPOINT).toBe('NetWorthTrendGraph');
    expect(AVAILABLE_DATE_RANGE_ENDPOINT).toBe('AvailableDateRange');
  });

  it('constructs composite endpoints correctly', () => {
    expect(CASH_FLOW_ENTRIES_AVAILABLE_DATE_RANGE_ENDPOINT).toBe('CashFlowEntries/AvailableDateRange');
    expect(HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT).toBe('HoldingSnapshots/AvailableDateRange');
  });

  it('has correct endpoint string values', () => {
    const endpoints = [
      BUDGETS_ENDPOINT,
      CASH_FLOW_ENTRIES_ENDPOINT,
      CASH_FLOW_CATEGORIES_ENDPOINT,
      HOLDING_SNAPSHOTS_ENDPOINT,
      HOLDINGS_ENDPOINT,
      HOLDING_CATEGORIES_ENDPOINT,
      CASH_FLOW_TREND_GRAPH_ENDPOINT,
      NET_WORTH_TREND_GRAPH_ENDPOINT,
      AVAILABLE_DATE_RANGE_ENDPOINT,
    ];

    endpoints.forEach(endpoint => {
      expect(typeof endpoint).toBe('string');
      expect(endpoint.length).toBeGreaterThan(0);
    });
  });
});
