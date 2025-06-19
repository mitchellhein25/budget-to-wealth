'use client';

import React, { useEffect, useState } from 'react'
import { holdingFormOnChange } from '@/app/ui/components/net-worth/holdings/form/functions/holdingFormOnChange';
import { useList } from '@/app/ui/hooks/useFormList';
import { handleFormSubmit } from '@/app/ui/components/form/functions/handleFormSubmit';
import { HoldingSnapshot } from '@/app/lib/models/net-worth/HoldingSnapshot';
import { formatDate, getMonthRange } from '@/app/ui/components/cashflow/CashFlowUtils';
import { DateRange } from 'react-day-picker';
import { HoldingSnapshotFormData } from '@/app/ui/components/net-worth/holding-snapshots/HoldingSnapshotFormData';
import { transformFormDataToHoldingSnapshot } from '@/app/ui/components/net-worth/holding-snapshots/functions/transformFormDataToHoldingSnapshot';
import HoldingSnapshotForm from '@/app/ui/components/net-worth/holding-snapshots/HoldingSnapshotForm';
import { holdingSnapshotFormOnChange } from '@/app/ui/components/net-worth/holding-snapshots/functions/holdingSnapshotFormOnChange';

export default function HoldingSnapshotsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getMonthRange(new Date()));
  const { items, isLoading, message, fetchItems, setMessage, setInfoMessage, setErrorMessage } = useList<HoldingSnapshot>(`HoldingSnapshots?startDate=${formatDate(dateRange.from)}&endDate=${formatDate(dateRange.to)}`, "holding snapshots");
	const [editingFormData, setEditingFormData] = useState<Partial<HoldingSnapshotFormData>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleSubmit = (formData: FormData) => handleFormSubmit<HoldingSnapshot | null, HoldingSnapshotFormData>(
		formData,
		transformFormDataToHoldingSnapshot,
		setIsSubmitting,
		setMessage,
		setErrorMessage,
		setInfoMessage,
		fetchItems,
		setEditingFormData,
		"holdings",
		"Holdings"
	);

	const onHoldingSnapshotIsEditing = (holdingSnapshot: HoldingSnapshot) => {
		setEditingFormData({
			id: holdingSnapshot.id?.toString(),
			holdingId: holdingSnapshot.holdingId,
			date: new Date(holdingSnapshot.date),
			balance: holdingSnapshot.balance.toString(),
		});
		setMessage({ type: null, text: '' });
	};

	const onReset = () => {
		setEditingFormData({});
		setMessage({ type: null, text: '' });
	};

	useEffect(() => {
		fetchItems();
	}, []);
  
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <HoldingSnapshotForm
            handleSubmit={handleSubmit}
            editingFormData={editingFormData}
            onChange={(event) => holdingSnapshotFormOnChange(event, setEditingFormData)}
            onReset={onReset}
            errorMessage={message.type === 'error' ? message.text : ''}
            infoMessage={message.type === 'info' ? message.text : ''}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {/* <HoldingsList
            holdings={items}
            isLoading={isLoading}
            message={message}
            onHoldingDeleted={fetchItems}
            onHoldingIsEditing={onHoldingIsEditing}
          /> */}
        </div>
      </div>
    </div>
  )
}
