'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import InputFieldSetTemplate from '@/app/ui/components/form/InputFieldSetTemplate';
import React, { useEffect, useState } from 'react'
import { HoldingSnapshotFormData } from './HoldingSnapshotFormData';
import { Holding } from '@/app/lib/models/net-worth/Holding';

interface HoldingSnapshotInputsProps {
  editingFormData: Partial<HoldingSnapshotFormData>;
  onChange: React.ChangeEventHandler;
}

export default function HoldingSnapshotInputs(props: HoldingSnapshotInputsProps) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  // const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  
  async function fetchHoldings() {
    // setInfoMessage("");
    // setErrorMessage("");
    // setIsLoading(true);
    const response = await getRequest<Holding>(`Holdings`);
    if (response.successful) {
      setHoldings(response.data as Holding[]);
    }
  }

  useEffect(() => {
    fetchHoldings();
  }, []);

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
          <select
            id={`holding-snapshot-holdingId`}
            name={`holding-snapshot-holdingId`}
            value={props.editingFormData.holdingId || ""}
            onChange={props.onChange}
            className="select"
          >
            <option value="" disabled>Pick a holding</option>
            {holdings.map((holding) => (
              <option key={holding.id} value={holding.id}>
                {`${holding.name} - ${holding.holdingCategory?.name} (${holding.type})`}
              </option>
            ))}
          </select>
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
                ? new Date(props.editingFormData.date).toISOString().slice(0, 10)
                : ""
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
