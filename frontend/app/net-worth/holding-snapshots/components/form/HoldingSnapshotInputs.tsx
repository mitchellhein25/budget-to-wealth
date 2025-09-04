'use client';

import React, { useEffect, useState } from 'react'
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { getAllHoldings } from '@/app/lib/api';
import { convertDateToISOString } from '@/app/lib/utils';
import { InputFieldSetTemplate, CurrencyInputField } from '@/app/components';
import { HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID, HOLDING_SNAPSHOT_ITEM_NAME_LINK, HoldingSnapshotFormData, NET_WORTH_ITEM_NAME_LINK } from '@/app/net-worth/holding-snapshots';
import { Holding, HOLDING_ITEM_NAME_LOWERCASE_PLURAL } from '@/app/net-worth/holding-snapshots/holdings';

interface HoldingSnapshotInputsProps {
  editingFormData: Partial<HoldingSnapshotFormData>;
  onChange: React.ChangeEventHandler;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function HoldingSnapshotInputs({ editingFormData, onChange, setIsLoading }: HoldingSnapshotInputsProps) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  

  useEffect(() => {
    async function fetchHoldings() {
      setIsLoading(true);
      const response = await getAllHoldings();
      if (response.successful) {
        setHoldings((response.data as Holding[]).sort((a, b) => a.name.localeCompare(b.name)));
      }
      setIsLoading(false);
    }
    fetchHoldings();
  }, [setIsLoading]);

  return (
    <>
      <input
        id={`${HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID}-id`}
        name={`${HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID}-id`}
        readOnly
        type="text"
        value={editingFormData?.id ?? ''}
        hidden={true}
      />
      <InputFieldSetTemplate 
        label="Holding" 
        isRequired={true}
        inputChild={
          <div className="flex items-center gap-2">
            <select
              id={`${HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID}-holdingId`}
              name={`${HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID}-holdingId`}
              value={editingFormData.holdingId || ""}
              onChange={onChange}
              className="select flex-1"
            >
              <option value="" disabled>Pick a holding</option>
              {holdings.map((holding) => (
                <option key={holding.id} value={holding.id}>
                  {`${holding.name} ${holding.institution ? `- ${holding.institution}` : ''} - ${holding.holdingCategory?.name} (${holding.type})`}
                </option>
              ))}
            </select>
            <Link
              href={`/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_SNAPSHOT_ITEM_NAME_LINK}/${HOLDING_ITEM_NAME_LOWERCASE_PLURAL}`}
              className="btn btn-ghost btn-sm btn-circle"
              title="Edit Holdings"
            >
              <Edit size={16} />
            </Link>
          </div>
        }
      />
      <InputFieldSetTemplate 
        label="Date" 
        isRequired={true}
        inputChild={
          <input
            id={`${HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID}-date`}
            name={`${HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID}-date`}
            type="date"
            value={
              editingFormData?.date
                ? convertDateToISOString(new Date(editingFormData.date))
                : convertDateToISOString(new Date())
            }
            onChange={onChange}
            className="input m-0 w-full" 
          />
        }
      />
      <InputFieldSetTemplate 
        label="Balance" 
        isRequired={true}
        inputChild={
          <CurrencyInputField
            id={`${HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID}-balance`}
            name={`${HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID}-balance`}
            value={editingFormData?.balance ?? ""}
            onChange={onChange}
            placeholder="0.00"
            className="input m-0 w-full"
          />}
      />
    </>
  )
}
