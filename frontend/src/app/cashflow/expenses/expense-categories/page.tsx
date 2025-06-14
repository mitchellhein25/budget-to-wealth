'use client'

import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import CashFlowCategoriesPage from '@/app/ui/components/cashflow/categories/CashFlowCategoriesPage';
import React from 'react'

export default function ExpenseCategories() {
  return (
    <CashFlowCategoriesPage 
      isLoggedIn={true} 
      cashFlowType={CashFlowType.Expense} 
    />
  )	
}
