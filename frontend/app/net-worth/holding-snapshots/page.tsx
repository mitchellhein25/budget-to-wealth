'use client';

import React, { useCallback, useEffect, useState } from 'react'
import {  useForm, useFormListItemsFetch } from '@/app/hooks';
import { HOLDING_SNAPSHOTS_ENDPOINT, getHoldingSnapshotsByDateRange, getLatestHoldingSnapshots } from '@/app/lib/api';
import { getFullMonthRange, messageTypeIsError } from '@/app/lib/utils';
import { DatePicker, DateRange, ResponsiveFormListPage } from '@/app/components';
import { NetWorthSideBar } from '@/app/net-worth';
import { convertHoldingSnapshotToFormData, HOLDING_SNAPSHOT_ITEM_NAME, HOLDING_SNAPSHOT_ITEM_NAME_LOWERCASE, HoldingSnapshot, HoldingSnapshotForm, HoldingSnapshotFormData, HoldingSnapshotsList, transformFormDataToHoldingSnapshot } from '@/app/net-worth/holding-snapshots';

export default function HoldingSnapshotsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getFullMonthRange(new Date()));
  const [showLatestOnly, setShowLatestOnly] = useState<boolean>(true);
  
  const fetchHoldingSnapshotsFunction = useCallback(() => showLatestOnly ? getLatestHoldingSnapshots() : getHoldingSnapshotsByDateRange(dateRange), [dateRange, showLatestOnly]);
  const { fetchItems, isPending: isPendingHoldingSnapshots, message: messageHoldingSnapshots, items: snapshots } = useFormListItemsFetch<HoldingSnapshot>({
    fetchItems: fetchHoldingSnapshotsFunction,
    itemName: HOLDING_SNAPSHOT_ITEM_NAME_LOWERCASE,
  });

  const formState = useForm<HoldingSnapshot, HoldingSnapshotFormData>(
    {
      itemName: HOLDING_SNAPSHOT_ITEM_NAME,
      itemEndpoint: HOLDING_SNAPSHOTS_ENDPOINT,
      transformFormDataToItem: transformFormDataToHoldingSnapshot,
      convertItemToFormData: convertHoldingSnapshotToFormData,
      fetchItems: fetchItems,
    }
  );

  const datePickerAndCheckbox = (
    <>
      <div className="flex items-center gap-2">
        <input
          id="show-latest-only"
          type="checkbox"
          className="checkbox"
          checked={showLatestOnly}
          onChange={(e) => setShowLatestOnly(e.target.checked)}
        />
        <label htmlFor="show-latest-only">Show most recent entries</label>
      </div>
      {!showLatestOnly && (
        <DatePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      )}
    </>
  );

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);
  
  return (
    <ResponsiveFormListPage
      sideBar={<NetWorthSideBar />}
      totalDisplay={<div className="w-full"></div>}
      datePicker={datePickerAndCheckbox}
      form={
        <HoldingSnapshotForm
          formState={formState}
        />
      }
      list={
        <HoldingSnapshotsList
          snapshots={snapshots}
          onSnapshotDeleted={fetchItems}
          onSnapshotIsEditing={formState.onItemIsEditing}
          isLoading={isPendingHoldingSnapshots}
          isError={messageTypeIsError(messageHoldingSnapshots)}
        />
      }
    />
  );
}
