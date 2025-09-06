import React from 'react'
import { TotalDisplay } from '@/app/components'
import { CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow'
import { avgNumberList, maxNumberList, medianNumberList, minNumberList } from '@/app/dashboards'

export function CashFlowTotalDisplays({ incomes, expenses, netCashFlows }: 
  { incomes: number[], expenses: number[], netCashFlows: number[] }) {
  return (
    <div className="mt-3 sm:mt-4 space-y-3">  
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <TotalDisplay compact label={`${INCOME_ITEM_NAME} - Min`} amount={minNumberList(incomes)} />
        <TotalDisplay compact label={`${INCOME_ITEM_NAME} - Median`} amount={medianNumberList(incomes)} />
        <TotalDisplay compact label={`${INCOME_ITEM_NAME} - Average`} amount={avgNumberList(incomes)} />
        <TotalDisplay compact label={`${INCOME_ITEM_NAME} - Max`} amount={maxNumberList(incomes)} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <TotalDisplay compact label={`${EXPENSE_ITEM_NAME_PLURAL} - Min`} amount={minNumberList(expenses)} />
        <TotalDisplay compact label={`${EXPENSE_ITEM_NAME_PLURAL} - Median`} amount={medianNumberList(expenses)} />
        <TotalDisplay compact label={`${EXPENSE_ITEM_NAME_PLURAL} - Average`} amount={avgNumberList(expenses)} />
        <TotalDisplay compact label={`${EXPENSE_ITEM_NAME_PLURAL} - Max`} amount={maxNumberList(expenses)} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <TotalDisplay compact label={`${CASHFLOW_ITEM_NAME} - Min`} amount={minNumberList(netCashFlows)} />
        <TotalDisplay compact label={`${CASHFLOW_ITEM_NAME} - Median`} amount={medianNumberList(netCashFlows)} />
        <TotalDisplay compact label={`${CASHFLOW_ITEM_NAME} - Average`} amount={avgNumberList(netCashFlows)} />
        <TotalDisplay compact label={`${CASHFLOW_ITEM_NAME} - Max`} amount={maxNumberList(netCashFlows)} />
      </div>
    </div>
  )
}
