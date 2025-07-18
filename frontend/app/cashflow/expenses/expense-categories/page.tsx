'use client';

import CategoriesPage from '@/app/components/categories/CategoriesPage';
import { useParentPath } from '@/app/hooks/useParentPath';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ExpenseCategories() {
  const searchParams = useSearchParams();  
  const parentPath = useParentPath();
  const returnUrl = searchParams.get('returnUrl') || parentPath;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={returnUrl}
          className="btn btn-ghost btn-sm gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>
      
      <CategoriesPage 
        isLoggedIn={true} 
        categoryTypeName="Expense"
        getEndpoint="CashFlowCategories?cashFlowType=Expense"
        createUpdateDeletEndpoint="CashFlowCategories"
      />
    </div>
  )	
}
