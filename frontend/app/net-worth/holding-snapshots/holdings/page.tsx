'use client';

import React, { useCallback } from 'react'
import { useForm, useParentPath, useMobileDetection, useFormListItemsFetch, mobileStateIsMediumOrSmaller } from '@/app/hooks';
import { getAllHoldings, HOLDINGS_ENDPOINT } from '@/app/lib/api';
import { messageTypeIsError } from '@/app/lib/utils';
import { BackArrow } from '@/app/components';
import { HOLDING_ITEM_NAME, Holding, HoldingsList, HoldingForm, HoldingFormData, transformFormDataToHolding, HOLDING_ITEM_NAME_LOWERCASE, convertHoldingToFormData } from '@/app/net-worth/holding-snapshots/holdings';

export default function HoldingsPage() {
  const parentPath = useParentPath();
  const mobileState = useMobileDetection();

  const fetchHoldings = useCallback( () => getAllHoldings(), []);
  const { fetchItems: fetchHoldingItems, isPending: isPendingHoldings, message: messageHoldings, items: holdings } = useFormListItemsFetch<Holding>({
    fetchItems: fetchHoldings,
    itemName: HOLDING_ITEM_NAME_LOWERCASE,
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
              holdings={holdings}
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
