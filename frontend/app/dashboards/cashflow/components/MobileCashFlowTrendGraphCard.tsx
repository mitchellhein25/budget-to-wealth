import React from 'react'
import { convertCentsToDollars, formatDate } from '@/app/lib/utils'
import { CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow'
import { MobileListItemCard } from '@/app/components'
import { CashFlowTrendGraphEntry } from '@/app/dashboards/cashflow'

export default function MobileCashFlowTrendGraphCard({ item }: { item: CashFlowTrendGraphEntry }) {
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
            <div className={labelClass}>{INCOME_ITEM_NAME}</div>
            <div className={valueClass}>{convertCentsToDollars(item.incomeInCents)}</div>
          </div>
          <div className="text-center">
            <div className={labelClass}>{EXPENSE_ITEM_NAME_PLURAL}</div>
            <div className={valueClass}>{convertCentsToDollars(item.expensesInCents)}</div>
          </div>
          <div className="text-center">
            <div className={labelClass}>{CASHFLOW_ITEM_NAME}</div>
            <div className={valueClass}>{convertCentsToDollars(item.netCashFlowInCents)}</div>
          </div>
        </div>
      </div>
    </MobileListItemCard>
  )
}
