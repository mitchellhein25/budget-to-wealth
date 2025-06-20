'use client';

import React, { useEffect, useState } from 'react'
import { Holding } from '@/app/lib/models/net-worth/Holding';
import HoldingsList from '@/app/ui/components/net-worth/holdings/list/HoldingsList';
import { HoldingFormData } from '@/app/ui/components/net-worth/holdings/form/HoldingFormData';
import HoldingForm from '@/app/ui/components/net-worth/holdings/form/HoldingForm';
import { holdingFormOnChange } from '@/app/ui/components/net-worth/holdings/form/functions/holdingFormOnChange';
import { useList } from '@/app/ui/hooks/useFormList';
import { handleFormSubmit } from '@/app/ui/components/form/functions/handleFormSubmit';
import { transformFormDataToHolding } from '@/app/ui/components/net-worth/holdings/form/functions/transformFormDataToHolding';

export default function HoldingsPage() {
  const { items, isLoading, message, fetchItems, setMessage, setInfoMessage, setErrorMessage } = useList<Holding>("Holdings", "holdings");
	const [editingFormData, setEditingFormData] = useState<Partial<HoldingFormData>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleSubmit = (formData: FormData) => handleFormSubmit<Holding | null, HoldingFormData>(
		formData,
		transformFormDataToHolding,
		setIsSubmitting,
		setMessage,
		setErrorMessage,
		setInfoMessage,
		fetchItems,
		setEditingFormData,
		"holdings",
		"Holdings"
	);

	const onHoldingIsEditing = (holding: Holding) => {
		setEditingFormData({
			id: holding.id?.toString(),
			name: holding.name,
			type: holding.type,
			holdingCategoryId: holding.holdingCategoryId,
		});
		setMessage({ type: null, text: '' });
	};

	const onReset = () => {
		setEditingFormData({});
		setMessage({ type: null, text: '' });
	};

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);
  
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <HoldingForm
            handleSubmit={handleSubmit}
            editingFormData={editingFormData}
            onChange={(event) => holdingFormOnChange(event, setEditingFormData)}
            onReset={onReset}
            errorMessage={message.type === 'form-error' ? message.text : ''}
            infoMessage={message.type === 'form-info' ? message.text : ''}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <HoldingsList
            holdings={items}
            isLoading={isLoading}
            message={message}
            onHoldingDeleted={fetchItems}
            onHoldingIsEditing={onHoldingIsEditing}
          />
        </div>
      </div>
    </div>
  )
}
