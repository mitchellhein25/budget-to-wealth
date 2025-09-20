'use client';

import React from 'react'
import { MANUAL_INVESTMENT_CATEGORIES_ENDPOINT } from '@/app/lib/api'
import { BackArrow, CategoriesPage } from '@/app/components'
import { MANUAL_INVESTMENT_ITEM_NAME } from '@/app/net-worth/investment-returns'
import { useParentPath } from '@/app/hooks';

export default function ManualInvestmentCategoriesPage() {
  const parentPath = useParentPath();

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <BackArrow link={parentPath} />
      </div>
      <CategoriesPage
        categoryTypeName={MANUAL_INVESTMENT_ITEM_NAME}
        getEndpoint={MANUAL_INVESTMENT_CATEGORIES_ENDPOINT}
        createUpdateDeleteEndpoint={MANUAL_INVESTMENT_CATEGORIES_ENDPOINT}
      />
    </div>
  )
}
