import React from 'react'
import { TotalDisplay } from '@/app/components'
import { ASSET_ITEM_NAME_PLURAL, DEBT_ITEM_NAME_PLURAL, NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots'
import { avgNumberList, maxNumberList, medianNumberList, minNumberList } from '@/app/dashboards'

export function NetWorthTotalDisplays({ assets, debts, netWorths }: { assets: number[], debts: number[], netWorths: number[] }) {
  const gridClass = "grid grid-cols-2 lg:grid-cols-4 gap-1";
  const marginOverride = "m-0";
  const totalDisplay = (label: string, amount: number) => 
    <TotalDisplay compact label={label} amount={amount} marginOverride={marginOverride} />

  return (
    <div className="mt-1 sm:mt-4 space-y-3">
      <div className={gridClass}>
        {totalDisplay(`${ASSET_ITEM_NAME_PLURAL} - Min`, minNumberList(assets))}
        {totalDisplay(`${ASSET_ITEM_NAME_PLURAL} - Median`, medianNumberList(assets))}
        {totalDisplay(`${ASSET_ITEM_NAME_PLURAL} - Average`, avgNumberList(assets))}
        {totalDisplay(`${ASSET_ITEM_NAME_PLURAL} - Max`, maxNumberList(assets))}
      </div>
      <div className={gridClass}>
        {totalDisplay(`${DEBT_ITEM_NAME_PLURAL} - Min`, minNumberList(debts))}
        {totalDisplay(`${DEBT_ITEM_NAME_PLURAL} - Median`, medianNumberList(debts))}
        {totalDisplay(`${DEBT_ITEM_NAME_PLURAL} - Average`, avgNumberList(debts))}
        {totalDisplay(`${DEBT_ITEM_NAME_PLURAL} - Max`, maxNumberList(debts))}
      </div>
      <div className={gridClass}>
        {totalDisplay(`${NET_WORTH_ITEM_NAME} - Min`, minNumberList(netWorths))}
        {totalDisplay(`${NET_WORTH_ITEM_NAME} - Median`, medianNumberList(netWorths))}
        {totalDisplay(`${NET_WORTH_ITEM_NAME} - Average`, avgNumberList(netWorths))}
        {totalDisplay(`${NET_WORTH_ITEM_NAME} - Max`, maxNumberList(netWorths))}
      </div>
    </div>
  )
}
