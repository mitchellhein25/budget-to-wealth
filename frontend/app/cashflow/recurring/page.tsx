'use client';

import React, { useState } from 'react'
import { CashFlowPage, CashFlowType, EXPENSE_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow/components';
import CashFlowTypeRadioButtons from './components/CashFlowTypeRadioButtons';

export default function RecurringCashFlowPage() {
	const [selectedType, setSelectedType] = useState<CashFlowType>(INCOME_ITEM_NAME);

	return (
		<div className="flex flex-col">
			<CashFlowTypeRadioButtons selectedType={selectedType} setSelectedType={setSelectedType} />
			<CashFlowPage cashFlowType={selectedType} />
		</div>
	)
}
