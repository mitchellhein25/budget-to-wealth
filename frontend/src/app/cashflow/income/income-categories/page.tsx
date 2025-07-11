'use client';

import CategoriesPage from '@/app/ui/components/categories/CategoriesPage';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParentPath } from '@/app/ui/hooks/useParentPath';

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
				categoryTypeName="Income"
				getEndpoint="CashFlowCategories?cashFlowType=Income"
				createUpdateDeletEndpoint="CashFlowCategories"
			/>
		</div>
	)	
}
