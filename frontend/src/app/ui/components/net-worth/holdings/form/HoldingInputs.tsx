'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import InputFieldSetTemplate from '@/app/ui/components/form/InputFieldSetTemplate';
import React, { useEffect, useState } from 'react'
import { HoldingFormData } from './HoldingFormData';
import { HoldingType } from '@/app/lib/models/net-worth/HoldingType';
import { Category } from '@/app/lib/models/Category';
import { Edit } from 'lucide-react';
import Link from 'next/link';

interface HoldingInputsProps {
  editingFormData: Partial<HoldingFormData>;
  onChange: React.ChangeEventHandler;
}

export default function HoldingInputs(props: HoldingInputsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  // const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  
  async function fetchCategories() {
    // setInfoMessage("");
    // setErrorMessage("");
    // setIsLoading(true);
    const response = await getRequest<Category>(`HoldingCategories`);
    if (response.successful) {
      setCategories((response.data as Category[]).sort((a, b) => a.name.localeCompare(b.name)));
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <input
        id={`holding-id`}
        name={`holding-id`}
        readOnly
        type="text"
        value={props.editingFormData?.id ?? ''}
        hidden={true}
      />
      <InputFieldSetTemplate 
        label="Name" 
        isRequired={true}
        inputChild={
          <input
            id={`holding-name`}
            name={`holding-name`}
            type="text"
            value={props.editingFormData?.name ?? ""}
            onChange={props.onChange}
            className="input m-0 w-full" 
          />
        }
      />
      <InputFieldSetTemplate 
        label="Type" 
        isRequired={true}
        inputChild={
          <select
            id={`holding-type`}
            name={`holding-type`}
            value={props.editingFormData.type || HoldingType.Asset}
            onChange={props.onChange}
            className="select"
          >
            <option value={HoldingType.Asset}>{HoldingType.Asset}</option>
            <option value={HoldingType.Debt}>{HoldingType.Debt}</option>
          </select>
        }
      />
      <InputFieldSetTemplate 
        label="Category" 
        isRequired={true}
        inputChild={
          <div className="flex items-center gap-2">
            <select
              id={`holding-holdingCategoryId`}
              name={`holding-holdingCategoryId`}
              value={props.editingFormData.holdingCategoryId || ""}
              onChange={props.onChange}
              className="select flex-1"
            >
              <option value="" disabled>Pick a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Link
              href="/net-worth/holdings/holding-categories"
              className="btn btn-ghost btn-sm btn-circle"
              title="Edit Holding Categories"
            >
              <Edit size={16} />
            </Link>
          </div>
        }
      />
      <InputFieldSetTemplate 
        label="Institution" 
        isRequired={false}
        inputChild={
          <input
            id={`holding-institution`}
            name={`holding-institution`}
            type="text"
            value={props.editingFormData.institution ?? ""}
            onChange={props.onChange}
            className="input m-0 w-full"
          />
        }
      />
    </>
  )
}
