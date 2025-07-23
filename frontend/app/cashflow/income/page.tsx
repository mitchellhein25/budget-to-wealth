'use client';

import React from 'react'
import { INCOME_ITEM_NAME, CashFlowPage } from '@/app/cashflow/components';

export default function Income() {

	return (
		<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />
	)
}
