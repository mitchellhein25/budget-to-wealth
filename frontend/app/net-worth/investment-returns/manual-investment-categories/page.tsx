import React from 'react'
import { MANUAL_INVESTMENT_CATEGORIES_ENDPOINT } from '@/app/lib/api'
import { CategoriesPage } from '@/app/components'
import { MANUAL_INVESTMENT_ITEM_NAME } from '@/app/net-worth/investment-returns'

export function ManualInvestmentCategoriesPage() {
  return (
    <CategoriesPage
    isLoggedIn={true} 
    categoryTypeName={MANUAL_INVESTMENT_ITEM_NAME}
    getEndpoint={MANUAL_INVESTMENT_CATEGORIES_ENDPOINT}
    createUpdateDeleteEndpoint={MANUAL_INVESTMENT_CATEGORIES_ENDPOINT}
    />
  )
}
