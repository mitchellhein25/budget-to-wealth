'use client';

import { useParentPath } from '@/app/hooks';
import { HOLDING_CATEGORIES_ENDPOINT } from '@/app/lib/api/data-methods';
import { BackArrow } from '@/app/components/buttons';
import { CategoriesPage } from '@/app/components/categories/CategoriesPage';
import { HOLDING_ITEM_NAME } from '../components';

export default function HoldingCategories() {
  const parentPath = useParentPath();

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <BackArrow link={parentPath} />
      </div>
      <CategoriesPage 
        isLoggedIn={true} 
        categoryTypeName={HOLDING_ITEM_NAME}
        getEndpoint={HOLDING_CATEGORIES_ENDPOINT}
        createUpdateDeleteEndpoint={HOLDING_CATEGORIES_ENDPOINT}
      />
    </div>
  )
}
