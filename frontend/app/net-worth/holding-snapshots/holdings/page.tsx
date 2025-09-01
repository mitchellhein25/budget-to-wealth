'use client';

import React, { useCallback, useState } from 'react'
import { useForm, useParentPath, useMobileDetection, useFormListItemsFetch, mobileStateIsMediumOrSmaller } from '@/app/hooks';
import { getAllHoldings, HOLDINGS_ENDPOINT } from '@/app/lib/api/data-methods';
import { HOLDING_ITEM_NAME, Holding, HoldingsList, HoldingForm, HoldingFormData, transformFormDataToHolding, HOLDING_ITEM_NAME_LOWERCASE, convertHoldingToFormData } from './components';
import { messageTypeIsError } from '@/app/components/Utils';
import { BackArrow } from '@/app/components/buttons/BackArrow';

export default function HoldingsPage() {
  const parentPath = useParentPath();
  const mobileState = useMobileDetection();

  const [items, setItems] = useState<Holding[]>([]);
  const fetchHoldings = useCallback( () => getAllHoldings(), []);
  const { fetchItems: fetchHoldingItems, isPending: isPendingHoldings, message: messageHoldings } = useFormListItemsFetch<Holding>({
    fetchItems: fetchHoldings,
    itemName: HOLDING_ITEM_NAME_LOWERCASE,
    setItems: setItems,
  });
  
  const formState = useForm<Holding, HoldingFormData>({
      itemName: HOLDING_ITEM_NAME,
      itemEndpoint: HOLDINGS_ENDPOINT,
      transformFormDataToItem: transformFormDataToHolding,
      convertItemToFormData: convertHoldingToFormData,
      fetchItems: fetchHoldingItems,
    });

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-3 sm:mb-4">
        <BackArrow link={parentPath} />
      </div>
      
      <div className="flex gap-3 sm:gap-6 h-full min-h-screen">
        <div className={`flex flex-1 gap-3 sm:gap-6 ${mobileStateIsMediumOrSmaller(mobileState) ? 'flex-col' : ''}`}>
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
              isLoading={isPendingHoldings}
              isError={messageTypeIsError(messageHoldings)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
