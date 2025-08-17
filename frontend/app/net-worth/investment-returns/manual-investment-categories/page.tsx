import { CategoriesPage } from '@/app/components/categories'
import React from 'react'
import { MANUAL_INVESTMENT_ITEM_NAME } from '../components'
import { MANUAL_INVESTMENT_CATEGORIES_ENDPOINT } from '@/app/lib/api/data-methods'

export default function ManualInvestmentCategories() {
  return (
    <CategoriesPage
    isLoggedIn={true} 
    categoryTypeName={MANUAL_INVESTMENT_ITEM_NAME}
    getEndpoint={MANUAL_INVESTMENT_CATEGORIES_ENDPOINT}
    createUpdateDeleteEndpoint={MANUAL_INVESTMENT_CATEGORIES_ENDPOINT}
    />
  )
}
