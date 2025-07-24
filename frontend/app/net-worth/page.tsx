'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { DatePicker, DateRange, getCurrentMonthRange, messageTypeIsError } from '@/app/components';
import { useDataListFetcher, useForm } from '@/app/hooks';
import { HOLDING_SNAPSHOTS_ENDPOINT, getHoldingSnapshotsByDateRange } from '@/app/lib/api/data-methods';
import { HOLDING_SNAPSHOT_ITEM_NAME, HoldingSnapshot, HoldingSnapshotForm, HoldingSnapshotFormData, HoldingSnapshotsList, transformFormDataToHoldingSnapshot } from '@/app/net-worth/components';

export default function HoldingSnapshotsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const fetchHoldingSnapshots = useCallback( () => getHoldingSnapshotsByDateRange(dateRange), [dateRange]);
	const holdingSnapshotsDataListFetchState = useDataListFetcher<HoldingSnapshot>(fetchHoldingSnapshots, HOLDING_SNAPSHOT_ITEM_NAME);
  
  const convertHoldingSnapshotToFormData = (holdingSnapshot: HoldingSnapshot) => ({
    id: holdingSnapshot.id?.toString(),
    holdingId: holdingSnapshot.holdingId,
    date: new Date(holdingSnapshot.date),
    balance: (holdingSnapshot.balance / 100).toFixed(2),
  });

  const formState = useForm<HoldingSnapshot, HoldingSnapshotFormData>(
    {
      itemName: HOLDING_SNAPSHOT_ITEM_NAME,
      itemEndpoint: HOLDING_SNAPSHOTS_ENDPOINT,
      transformFormDataToItem: transformFormDataToHoldingSnapshot,
      convertItemToFormData: convertHoldingSnapshotToFormData,
      fetchItems: () => holdingSnapshotsDataListFetchState.fetchItems(),
    }
  );

	useEffect(() => {
		holdingSnapshotsDataListFetchState.fetchItems();
	}, [dateRange]);
  
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <HoldingSnapshotForm
            formState={formState}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <DatePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <HoldingSnapshotsList
            snapshots={holdingSnapshotsDataListFetchState.items}
            onSnapshotDeleted={holdingSnapshotsDataListFetchState.fetchItems}
            onSnapshotIsEditing={formState.onItemIsEditing}
            isLoading={holdingSnapshotsDataListFetchState.isLoading}
            isError={messageTypeIsError(holdingSnapshotsDataListFetchState.message)}
          />
        </div>
      </div>
    </div>
  )
}
