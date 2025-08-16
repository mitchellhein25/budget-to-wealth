'use client';

import React from 'react'
import { NetWorthSideBar } from '../holding-snapshots/components/NetWorthSideBar';
import { useForm, useMobileDetection } from '@/app/hooks';

export default function InvestmentReturnsPage() {
  const isMobile = useMobileDetection();

  // const formState = useForm<Investment, HoldingSnapshotFormData>(
  //   {
  //     itemName: HOLDING_SNAPSHOT_ITEM_NAME,
  //     itemEndpoint: HOLDING_SNAPSHOTS_ENDPOINT,
  //     transformFormDataToItem: transformFormDataToHoldingSnapshot,
  //     convertItemToFormData: convertHoldingSnapshotToFormData,
  //     fetchItems: fetchItems,
  //   }
  // );
  
  return (
    <div className="flex gap-6 pt-6 px-6 pb-0 h-full min-h-screen">
      {!isMobile && <NetWorthSideBar />}
    </div>
  )
}
