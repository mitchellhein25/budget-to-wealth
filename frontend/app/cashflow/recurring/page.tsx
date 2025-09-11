'use client';

import React, { useState } from 'react'
import { CashFlowPage, CashFlowType, EXPENSE_ITEM_NAME } from '@/app/cashflow';
import { CashFlowTypeRadioButtons } from '@/app/cashflow/recurring';

export default function RecurringCashFlowPage() {
	const [selectedType, setSelectedType] = useState<CashFlowType>(EXPENSE_ITEM_NAME);

	return (
		<div className="flex flex-col">
			<CashFlowTypeRadioButtons selectedType={selectedType} setSelectedType={setSelectedType} />
			<CashFlowPage cashFlowType={selectedType} recurringOnly={true} />
		</div>
	)
}
