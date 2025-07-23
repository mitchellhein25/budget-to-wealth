'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParentPath } from '@/app/hooks';
import CategoriesPage from '@/app/components/categories/CategoriesPage';
import { INCOME_ITEM_NAME } from '@/app/cashflow/components/constants';
import { CASH_FLOW_CATEGORIES_ENDPOINT } from '@/app/lib/api/data-methods';

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
				getEndpoint={`${CASH_FLOW_CATEGORIES_ENDPOINT}?cashFlowType=${INCOME_ITEM_NAME}`}
				createUpdateDeleteEndpoint={CASH_FLOW_CATEGORIES_ENDPOINT}
			/>
		</div>
	)	
}
