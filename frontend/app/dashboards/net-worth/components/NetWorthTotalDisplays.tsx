import React from 'react'
import { TotalDisplay } from '@/app/components'
import { ASSET_ITEM_NAME_PLURAL, DEBT_ITEM_NAME_PLURAL, NET_WORTH_ITEM_NAME } from '@/app/net-worth/components'
import { avgNumberList, maxNumberList, medianNumberList, minNumberList } from '../../components'

export function NetWorthTotalDisplays({ assets, debts, netWorths }: { assets: number[], debts: number[], netWorths: number[] }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <TotalDisplay compact label={`${ASSET_ITEM_NAME_PLURAL} - Min`} amount={minNumberList(assets)} />
        <TotalDisplay compact label={`${ASSET_ITEM_NAME_PLURAL} - Median`} amount={medianNumberList(assets)} />
        <TotalDisplay compact label={`${ASSET_ITEM_NAME_PLURAL} - Average`} amount={avgNumberList(assets)} />
        <TotalDisplay compact label={`${ASSET_ITEM_NAME_PLURAL} - Max`} amount={maxNumberList(assets)} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <TotalDisplay compact label={`${DEBT_ITEM_NAME_PLURAL} - Min`} amount={minNumberList(debts)} />
        <TotalDisplay compact label={`${DEBT_ITEM_NAME_PLURAL} - Median`} amount={medianNumberList(debts)} />
        <TotalDisplay compact label={`${DEBT_ITEM_NAME_PLURAL} - Average`} amount={avgNumberList(debts)} />
        <TotalDisplay compact label={`${DEBT_ITEM_NAME_PLURAL} - Max`} amount={maxNumberList(debts)} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <TotalDisplay compact label={`${NET_WORTH_ITEM_NAME} - Min`} amount={minNumberList(netWorths)} />
        <TotalDisplay compact label={`${NET_WORTH_ITEM_NAME} - Median`} amount={medianNumberList(netWorths)} />
        <TotalDisplay compact label={`${NET_WORTH_ITEM_NAME} - Average`} amount={avgNumberList(netWorths)} />
        <TotalDisplay compact label={`${NET_WORTH_ITEM_NAME} - Max`} amount={maxNumberList(netWorths)} />
      </div>
    </div>
  )
}
