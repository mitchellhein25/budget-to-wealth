import React from 'react'
import { TotalDisplay } from '@/app/components'
import { CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow'
import { avgNumberList, maxNumberList, medianNumberList, minNumberList } from '@/app/dashboards'

export function CashFlowTotalDisplays({ incomes, expenses, netCashFlows }: 
  { incomes: number[], expenses: number[], netCashFlows: number[] }) {
  const gridClass = "grid grid-cols-2 lg:grid-cols-4 gap-1";
  const marginOverride = "m-0";
  const totalDisplay = (label: string, amount: number) => 
    <TotalDisplay compact label={label} amount={amount} marginOverride={marginOverride} />
    
  return (
    <div className="mt-1 sm:mt-4 space-y-3">  
      <div className={gridClass}>
        {totalDisplay(`${INCOME_ITEM_NAME} - Min`, minNumberList(incomes))}
        {totalDisplay(`${INCOME_ITEM_NAME} - Median`, medianNumberList(incomes))}
        {totalDisplay(`${INCOME_ITEM_NAME} - Average`, avgNumberList(incomes))}
        {totalDisplay(`${INCOME_ITEM_NAME} - Max`, maxNumberList(incomes))}
      </div>
      <div className={gridClass}>
        {totalDisplay(`${EXPENSE_ITEM_NAME_PLURAL} - Min`, minNumberList(expenses))}
        {totalDisplay(`${EXPENSE_ITEM_NAME_PLURAL} - Median`, medianNumberList(expenses))}
        {totalDisplay(`${EXPENSE_ITEM_NAME_PLURAL} - Average`, avgNumberList(expenses))}
        {totalDisplay(`${EXPENSE_ITEM_NAME_PLURAL} - Max`, maxNumberList(expenses))}
      </div>
      <div className={gridClass}>
        {totalDisplay(`${CASHFLOW_ITEM_NAME} - Min`, minNumberList(netCashFlows))}
        {totalDisplay(`${CASHFLOW_ITEM_NAME} - Median`, medianNumberList(netCashFlows))}
        {totalDisplay(`${CASHFLOW_ITEM_NAME} - Average`, avgNumberList(netCashFlows))}
        {totalDisplay(`${CASHFLOW_ITEM_NAME} - Max`, maxNumberList(netCashFlows))}
      </div>
    </div>
  )
}
