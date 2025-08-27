import React from 'react'
import { CashFlowPage, INCOME_ITEM_NAME } from '@/app/cashflow/components';

export default function RecurringCashFlowPage() {

	return (
		<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />
	)
}
