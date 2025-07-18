'use client';

import CategoriesPage from '@/app/components/categories/CategoriesPage'
import { useParentPath } from '@/app/hooks/useParentPath';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
      categoryTypeName="Holding"
      getEndpoint="HoldingCategories"
      createUpdateDeletEndpoint="HoldingCategories"
    />
    </div>
  )
}
