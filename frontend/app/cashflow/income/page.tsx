'use client';

import { CashFlowType } from '@/app/cashflow/components/CashFlowType';
import CashFlowPage from '@/app/cashflow/components/CashFlowPage';
import React, {  } from 'react'

export default function Income() {

	return (
		<CashFlowPage cashFlowType={CashFlowType.Income} />
	)
}
