'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { DatePicker, DateRange, getCurrentMonthRange, MESSAGE_TYPE_ERROR, MessageState, messageTypeIsError } from '@/app/components';
import {  useForm, useMobileDetection } from '@/app/hooks';
import { HOLDING_SNAPSHOTS_ENDPOINT, getHoldingSnapshotsByDateRange, getLatestHoldingSnapshots } from '@/app/lib/api/data-methods';
import { HOLDING_SNAPSHOT_ITEM_NAME, HOLDING_SNAPSHOT_ITEM_NAME_LOWERCASE, HoldingSnapshot, HoldingSnapshotForm, HoldingSnapshotFormData, HoldingSnapshotsList, transformFormDataToHoldingSnapshot } from '@/app/net-worth/holding-snapshots/components';

export default function HoldingSnapshotsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const [items, setItems] = useState<HoldingSnapshot[]>([]);
  const [showLatestOnly, setShowLatestOnly] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
  const isMobile = useMobileDetection();

  const fetchHoldingSnapshots = useCallback(() => showLatestOnly ? getLatestHoldingSnapshots() : getHoldingSnapshotsByDateRange(dateRange), [dateRange, showLatestOnly]);
  
  const fetchItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessage({ type: MESSAGE_TYPE_ERROR, text });
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
      const response = await fetchHoldingSnapshots();
      if (!response.successful) {
        setErrorMessage(`Failed to load ${HOLDING_SNAPSHOT_ITEM_NAME_LOWERCASE}s. Please try again.`);
        return;
      }
      setItems(response.data as HoldingSnapshot[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${HOLDING_SNAPSHOT_ITEM_NAME_LOWERCASE}s. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchHoldingSnapshots]);
  
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
      fetchItems: fetchItems,
    }
  );

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);
  
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <div className={`flex flex-1 gap-6 ${isMobile ? 'flex-col' : ''}`}>
        <div className="flex-shrink-0">
          <HoldingSnapshotForm
            formState={formState}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
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
          <HoldingSnapshotsList
            snapshots={items}
            onSnapshotDeleted={fetchItems}
            onSnapshotIsEditing={formState.onItemIsEditing}
            isLoading={isLoading}
            isError={messageTypeIsError(message)}
          />
        </div>
      </div>
    </div>
  )
}
