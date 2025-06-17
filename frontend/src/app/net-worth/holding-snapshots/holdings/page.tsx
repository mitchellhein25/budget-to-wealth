'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { Holding } from '@/app/lib/models/net-worth/Holding';
import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { MessageState } from '@/app/ui/components/cashflow/CashFlowUtils';
import HoldingsList from '@/app/ui/components/net-worth/holdings/list/HoldingsList';
import { HoldingFormData } from '@/app/ui/components/net-worth/holdings/form/HoldingFormData';
import HoldingForm from '@/app/ui/components/net-worth/holdings/form/HoldingForm';
import { handleHoldingFormSubmit } from '@/app/ui/components/net-worth/holdings/form/functions/handleHoldingFormSubmit';
import { holdingFormOnChange } from '@/app/ui/components/net-worth/holdings/form/functions/holdingFormOnChange';

export default function HoldingsPage() {
	const [holdings, setHoldings] = useState<Holding[]>([]);
	const [editingFormData, setEditingFormData] = useState<Partial<HoldingFormData>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

	const clearMessage = useCallback(() => {
		setTimeout(() => setMessage({ type: null, text: '' }), 1000 * 10);
	}, []);

	const setInfoMessage = useCallback((text: string) => {
		setMessage({ type: 'info', text });
		clearMessage();
	}, [clearMessage]);

	const setErrorMessage = useCallback((text: string) => {
		setMessage({ type: 'error', text });
		clearMessage();
	}, [clearMessage]);

	const handleSubmit = (formData: FormData) => handleHoldingFormSubmit(
		formData,
		setIsSubmitting,
		setMessage,
		setErrorMessage,
		setInfoMessage,
		fetchEntries,
		setEditingFormData
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

	const fetchEntries = async () => {
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
      const response = await getRequest<Holding>("Holdings");
      if (!response.successful) {
        setErrorMessage(`Failed to load holdings. Please try again.`);
        return;
      }
      setHoldings(response.data as Holding[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading holdings.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

	const onReset = () => {
		setEditingFormData({});
		setMessage({ type: null, text: '' });
	};

	useEffect(() => {
		fetchEntries();
	}, []);
  
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <HoldingForm
            handleSubmit={handleSubmit}
            editingFormData={editingFormData}
            onChange={(event) => holdingFormOnChange(event, setEditingFormData)}
            onReset={onReset}
            errorMessage={message.type === 'error' ? message.text : ''}
            infoMessage={message.type === 'info' ? message.text : ''}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <HoldingsList
            holdings={holdings}
            isLoading={isLoading}
            message={message}
            onHoldingDeleted={fetchEntries}
            onHoldingIsEditing={onHoldingIsEditing}
          />
        </div>
      </div>
    </div>
  )
}
