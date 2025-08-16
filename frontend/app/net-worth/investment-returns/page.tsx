'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { NetWorthSideBar } from '../holding-snapshots/components/NetWorthSideBar';
import { useForm, useMobileDetection } from '@/app/hooks';
import { INVESTMENT_RETURNS_ENDPOINT, getInvestmentReturns } from '@/app/lib/api/data-methods';
import { InvestmentReturn, InvestmentReturnForm, InvestmentReturnFormData } from './components';
import { transformFormDataToInvestmentReturn } from './components/form';
import { INVESTMENT_RETURN_ITEM_NAME } from '../holding-snapshots/components/constants';

export default function InvestmentReturnsPage() {
  const isMobile = useMobileDetection();
  const [items, setItems] = useState<InvestmentReturn[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    const response = await getInvestmentReturns();
    if (response.successful && response.data) setItems(response.data);
    setIsLoading(false);
  }, [getInvestmentReturns]);

  const convertItemToFormData = (item: InvestmentReturn): InvestmentReturnFormData => {
    return {} as any;
  };

  const formState = useForm<InvestmentReturn, InvestmentReturnFormData>({
    itemName: INVESTMENT_RETURN_ITEM_NAME,
    itemEndpoint: INVESTMENT_RETURNS_ENDPOINT,
    transformFormDataToItem: transformFormDataToInvestmentReturn,
    convertItemToFormData,
    fetchItems,
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  return (
    <div className="flex gap-6 pt-6 px-6 pb-0 h-full min-h-screen">
      {!isMobile && <NetWorthSideBar />}
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <InvestmentReturnForm formState={formState} />
        </div>
        <div className="flex-1">{/* TODO: list view */}</div>
      </div>
    </div>
  )
}
