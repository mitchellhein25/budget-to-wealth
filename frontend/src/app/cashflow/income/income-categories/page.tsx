'use client'

import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import CashFlowCategoriesPage from '@/app/ui/components/cashflow/categories/CashFlowCategoriesPage';
import React from 'react'

export default function IncomeCategories() {
	return (
		<CashFlowCategoriesPage 
			isLoggedIn={true} 
			cashFlowType={CashFlowType.Income} 
		/>
	)	
}
