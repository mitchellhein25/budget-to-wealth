'use client';

import CategoriesPage from '@/app/components/categories/CategoriesPage';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParentPath } from '@/app/hooks/useParentPath';
import { INCOME_ITEM_NAME } from '../../components/constants';
import { CASHFLOW_CATEGORIES_ENDPOINT } from '@/app/lib/api/data-methods/categoriesRequests';

export default function IncomeCategories() {
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
				categoryTypeName={INCOME_ITEM_NAME}
				getEndpoint={`${CASHFLOW_CATEGORIES_ENDPOINT}?cashFlowType=${INCOME_ITEM_NAME}`}
				createUpdateDeleteEndpoint={CASHFLOW_CATEGORIES_ENDPOINT}
			/>
		</div>
	)	
}
