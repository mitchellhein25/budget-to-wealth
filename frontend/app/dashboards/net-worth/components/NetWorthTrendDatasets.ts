import { ASSET_ITEM_NAME_PLURAL, DEBT_ITEM_NAME_PLURAL, NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots/components';
import { TrendGraphDataset } from '../../components';
import { NetWorthTrendGraphData } from './';

export function NetWorthTrendDatasets(data: NetWorthTrendGraphData | null): TrendGraphDataset[] {
  if (!data?.entries) return [];
  return [
    {
      type: 'line',
      label: ASSET_ITEM_NAME_PLURAL,
      data: data.entries.map(entry => entry.assetValueInCents / 100),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)'
    },
    {
      type: 'line',
      label: DEBT_ITEM_NAME_PLURAL,
      data: data.entries.map(entry => entry.debtValueInCents / 100),
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.5)'
    },
    {
      type: 'line',
      label: NET_WORTH_ITEM_NAME,
      data: data.entries.map(entry => entry.netWorthInCents / 100),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246)'
    }
  ];
}


