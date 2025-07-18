'use client';

import React, { useEffect, useState } from 'react'
import { Holding } from '@/app/net-worth/holdings/Holding';
import HoldingsList from '@/app/net-worth/holdings/components/list/HoldingsList';
import { HoldingFormData } from '@/app/net-worth/holdings/components/form/HoldingFormData';
import HoldingForm from '@/app/net-worth/holdings/components/form/HoldingForm';
import { holdingFormOnChange } from '@/app/net-worth/holdings/components/form/functions/holdingFormOnChange';
import { useList } from '@/app/components/form/useFormList';
import { handleFormSubmit } from '@/app/components/form/functions/handleFormSubmit';
import { transformFormDataToHolding } from '@/app/net-worth/holdings/components/form/functions/transformFormDataToHolding';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParentPath } from '@/app/hooks/useParentPath';

export default function HoldingsPage() {
  const parentPath = useParentPath();
  
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
		"holding",
		"Holdings"
	);

	const onHoldingIsEditing = (holding: Holding) => {
		setEditingFormData({
			id: holding.id?.toString(),
			name: holding.name,
			type: holding.type,
			holdingCategoryId: holding.holdingCategoryId,
			institution: holding.institution
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
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={parentPath}
          className="btn btn-ghost btn-sm gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>
      
      <div className="flex gap-6 h-full min-h-screen">
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
    </div>
  )
}
