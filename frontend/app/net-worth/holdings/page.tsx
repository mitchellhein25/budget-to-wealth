'use client';

import React, { useCallback, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm, useDataListFetcher, useParentPath } from '@/app/hooks';
import { getAllHoldings, HOLDINGS_ENDPOINT } from '@/app/lib/api/data-methods';
import { HOLDING_ITEM_NAME, Holding, HoldingsList, HoldingForm, HoldingFormData, transformFormDataToHolding } from './components';
import { messageTypeIsError } from '@/app/components/Utils';

export default function HoldingsPage() {
  const parentPath = useParentPath();

  const fetchHoldings = useCallback( () => getAllHoldings(), []);
	const holdingsDataListFetchState = useDataListFetcher<Holding>(fetchHoldings, HOLDING_ITEM_NAME);

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
      fetchItems: () => holdingsDataListFetchState.fetchItems(),
    });

	useEffect(() => {
		holdingsDataListFetchState.fetchItems();
	}, [holdingsDataListFetchState]);
  
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
              formState={formState}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <HoldingsList
              holdings={holdingsDataListFetchState.items}
              onHoldingDeleted={holdingsDataListFetchState.fetchItems}
              onHoldingIsEditing={formState.onItemIsEditing}
              isLoading={holdingsDataListFetchState.isLoading}
              isError={messageTypeIsError(holdingsDataListFetchState.message)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
