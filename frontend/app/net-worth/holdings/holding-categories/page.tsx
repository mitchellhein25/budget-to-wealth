'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParentPath } from '@/app/hooks';
import CategoriesPage from '@/app/components/categories/CategoriesPage';
import { HOLDING_CATEGORIES_ENDPOINT } from '@/app/lib/api/data-methods';
import { HOLDING_ITEM_NAME } from '../components';

export default function HoldingCategories() {
  const parentPath = useParentPath();

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={parentPath}
          className="btn btn-ghost btn-sm gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
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
