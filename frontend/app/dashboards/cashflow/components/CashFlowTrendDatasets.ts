import { TrendGraphDataset } from '@/app/dashboards';
import { CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow/components';
import { CashFlowTrendGraphData } from '@/app/dashboards/cashflow';

export function CashFlowTrendDatasets(data: CashFlowTrendGraphData | null): TrendGraphDataset[] {
  if (!data?.entries) return [];
  return [
    {
      type: 'bar',
      label: INCOME_ITEM_NAME,
      data: data.entries.map(entry => entry.incomeInCents / 100),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)'
    },
    {
      type: 'bar',
      label: EXPENSE_ITEM_NAME_PLURAL,
      data: data.entries.map(entry => -(entry.expensesInCents / 100)),
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.5)'
    },
    {
      type: 'line',
      label: `Net ${CASHFLOW_ITEM_NAME}`,
      data: data.entries.map(entry => entry.netCashFlowInCents / 100),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)'
    }
  ];
}


