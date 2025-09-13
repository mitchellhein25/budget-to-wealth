import React from 'react'
import { convertCentsToDollars, formatDate } from '@/app/lib/utils'
import { MobileListItemCard } from '@/app/components'
import { NetWorthTrendGraphEntry } from '@/app/dashboards/net-worth'
import { ASSET_ITEM_NAME_PLURAL, DEBT_ITEM_NAME_PLURAL, NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots'

export default function MobileNetWorthTrendGraphCard({ item }: { item: NetWorthTrendGraphEntry }) {
  const labelClass = "text-xs text-base-content/70 mb-1";
  const valueClass = "text-sm font-semibold text-base-content";
  return (
    <MobileListItemCard>
      <div className="flex items-center gap-3">
        <div className="text-xs text-base-content/70 flex-shrink-0">
          {formatDate(new Date(item.date), true)}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className={labelClass}>{ASSET_ITEM_NAME_PLURAL}</div>
            <div className={valueClass}>{convertCentsToDollars(item.assetValueInCents)}</div>
          </div>
          <div className="text-center">
            <div className={labelClass}>{DEBT_ITEM_NAME_PLURAL}</div>
            <div className={valueClass}>{convertCentsToDollars(item.debtValueInCents)}</div>
          </div>
          <div className="text-center">
            <div className={labelClass}>{NET_WORTH_ITEM_NAME}</div>
            <div className={valueClass}>{convertCentsToDollars(item.netWorthInCents)}</div>
          </div>
        </div>
      </div>
    </MobileListItemCard>
  )
}
