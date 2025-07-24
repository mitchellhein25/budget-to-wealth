'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import InputFieldSetTemplate from '@/app/components/form/InputFieldSetTemplate';
import React, { useEffect, useState } from 'react'
import { HoldingSnapshotFormData } from './HoldingSnapshotFormData';
import { Holding } from '@/app/net-worth/holdings/Holding';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { convertDateToISOString } from '../../../components/Utils';

interface HoldingSnapshotInputsProps {
  editingFormData: Partial<HoldingSnapshotFormData>;
  onChange: React.ChangeEventHandler;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function HoldingSnapshotInputs(props: HoldingSnapshotInputsProps) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  
  async function fetchHoldings() {
    props.setIsLoading(true);
    const response = await getRequest<Holding>(`Holdings`);
    if (response.successful) {
      setHoldings((response.data as Holding[]).sort((a, b) => a.name.localeCompare(b.name)));
    }
    props.setIsLoading(false);
  }

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  return (
    <>
      <input
        id={`holding-snapshot-id`}
        name={`holding-snapshot-id`}
        readOnly
        type="text"
        value={props.editingFormData?.id ?? ''}
        hidden={true}
      />
      <InputFieldSetTemplate 
        label="Holding" 
        isRequired={true}
        inputChild={
          <div className="flex items-center gap-2">
            <select
              id={`holding-snapshot-holdingId`}
              name={`holding-snapshot-holdingId`}
              value={props.editingFormData.holdingId || ""}
              onChange={props.onChange}
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
              href="/net-worth/holdings"
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
            id={`holding-snapshot-date`}
            name={`holding-snapshot-date`}
            type="date"
            value={
              props.editingFormData?.date
                ? convertDateToISOString(new Date(props.editingFormData.date))
                : convertDateToISOString(new Date())
            }
            onChange={props.onChange}
            className="input m-0 w-full" 
          />
        }
      />
      <InputFieldSetTemplate 
        label="Balance" 
        isRequired={true}
        inputChild={
          <input
            id={`holding-snapshot-balance`}
            name={`holding-snapshot-balance`}
            type="text"
            value={props.editingFormData?.balance ?? ""}
            onChange={props.onChange}
            placeholder="0.00" 
            className="input m-0 w-full" 
          />}
      />
    </>
  )
}
