'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm, useParentPath, useMobileDetection } from '@/app/hooks';
import { getAllHoldings, HOLDINGS_ENDPOINT } from '@/app/lib/api/data-methods';
import { HOLDING_ITEM_NAME, Holding, HoldingsList, HoldingForm, HoldingFormData, transformFormDataToHolding } from './components';
import { MESSAGE_TYPE_ERROR, MessageState, messageTypeIsError } from '@/app/components/Utils';

export default function HoldingsPage() {
  const parentPath = useParentPath();
  const [items, setItems] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
  const isMobile = useMobileDetection();

  const fetchHoldings = useCallback( () => getAllHoldings(), []);

  const fetchItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessage({ type: MESSAGE_TYPE_ERROR, text });
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
      const response = await fetchHoldings();
      if (!response.successful) {
        setErrorMessage(`Failed to load ${HOLDING_ITEM_NAME}s. Please try again.`);
        return;
      }
      setItems(response.data as Holding[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${HOLDING_ITEM_NAME}s. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchHoldings]);

	const convertHoldingToFormData = (holding: Holding) => ({
			id: holding.id?.toString(),
			name: holding.name,
			type: holding.type,
			holdingCategoryId: holding.holdingCategoryId,
			institution: holding.institution
		});
  
  const formState = useForm<Holding, HoldingFormData>({
      itemName: HOLDING_ITEM_NAME,
      itemEndpoint: HOLDINGS_ENDPOINT,
      transformFormDataToItem: transformFormDataToHolding,
      convertItemToFormData: convertHoldingToFormData,
      fetchItems: fetchItems,
    });

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
        <div className={`flex flex-1 gap-6 ${isMobile ? 'flex-col' : ''}`}>
          <div className="flex-shrink-0">
            <HoldingForm
              formState={formState}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <HoldingsList
              holdings={items}
              onHoldingDeleted={fetchHoldings}
              onHoldingIsEditing={formState.onItemIsEditing}
              isLoading={isLoading}
              isError={messageTypeIsError(message)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
