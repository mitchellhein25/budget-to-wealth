'use client';

import { useParentPath } from '@/app/hooks';
import { HOLDING_CATEGORIES_ENDPOINT } from '@/app/lib/api';
import { CategoriesPage, BackArrow } from '@/app/components';
import { HOLDING_ITEM_NAME } from '@/app/net-worth/holding-snapshots/holdings';

export default function HoldingCategoriesPage() {
  const parentPath = useParentPath();

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <BackArrow link={parentPath} />
      </div>
      <CategoriesPage 
        categoryTypeName={HOLDING_ITEM_NAME}
        getEndpoint={HOLDING_CATEGORIES_ENDPOINT}
        createUpdateDeleteEndpoint={HOLDING_CATEGORIES_ENDPOINT}
      />
    </div>
  )
}
