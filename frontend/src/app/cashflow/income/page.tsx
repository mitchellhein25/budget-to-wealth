'use client';

import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import CashFlowPage from '@/app/ui/components/cashflow/CashFlowPage';
import React, {  } from 'react'

export default function Income() {

	return (
		<CashFlowPage cashFlowType={CashFlowType.Income} />
	)
}
