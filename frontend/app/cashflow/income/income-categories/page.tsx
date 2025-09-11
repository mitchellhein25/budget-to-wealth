'use client';

import { useParentPath } from '@/app/hooks';
import { CASH_FLOW_CATEGORIES_ENDPOINT } from '@/app/lib/api';
import { CategoriesPage, BackArrow } from '@/app/components';
import { INCOME_ITEM_NAME } from '@/app/cashflow';

export default function IncomeCategoriesPage() {
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
