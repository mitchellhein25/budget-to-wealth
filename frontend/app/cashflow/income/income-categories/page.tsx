'use client';

import { useParentPath } from '@/app/hooks';
import { CategoriesPage } from '@/app/components/categories/CategoriesPage';
import { INCOME_ITEM_NAME } from '@/app/cashflow/components/components/constants';
import { CASH_FLOW_CATEGORIES_ENDPOINT } from '@/app/lib/api/data-methods';
import { BackArrow } from '@/app/components/buttons/BackArrow';

export default function IncomeCategories() {
  const parentPath = useParentPath();

	return (
		<div className="p-3 sm:p-6">
			<div className="mb-6">
				<BackArrow link={parentPath} />
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
