'use client';

import { useSearchParams } from 'next/navigation';
import { useParentPath } from '@/app/hooks';
import { CategoriesPage } from '@/app/components/categories/CategoriesPage';
import { EXPENSE_ITEM_NAME } from '@/app/cashflow/components/components/constants';
import { CASH_FLOW_CATEGORIES_ENDPOINT } from '@/app/lib/api/data-methods';
import { BackArrow } from '@/app/components/buttons/BackArrow';

export default function ExpenseCategories() {
  const searchParams = useSearchParams();  
  const parentPath = useParentPath();
  const returnUrl = searchParams.get('returnUrl') || parentPath;

  return (
    <div className="p-6">
      <div className="mb-6">
        <BackArrow link={returnUrl} />
      </div>
      
      <CategoriesPage 
        isLoggedIn={true} 
        categoryTypeName={EXPENSE_ITEM_NAME}
        getEndpoint={`${CASH_FLOW_CATEGORIES_ENDPOINT}?cashFlowType=${EXPENSE_ITEM_NAME}`}
        createUpdateDeleteEndpoint={CASH_FLOW_CATEGORIES_ENDPOINT}
      />
    </div>
  )	
}
