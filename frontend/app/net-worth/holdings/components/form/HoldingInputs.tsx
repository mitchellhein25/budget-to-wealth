'use client';

import React, { useEffect, useState } from 'react'
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { InputFieldSetTemplate } from '@/app/components/form';
import { Category } from '@/app/components/categories/Category';
import { getAllHoldingCategories } from '@/app/lib/api/data-methods';
import { HOLDING_CATEGORY_ITEM_NAME_PLURAL, HOLDING_ITEM_NAME_LOWERCASE, HOLDING_TYPE_ASSET, HOLDING_TYPE_DEBT, HoldingFormData } from '..';

interface HoldingInputsProps {
  editingFormData: Partial<HoldingFormData>;
  onChange: React.ChangeEventHandler;
  setIsLoading: (isLoading: boolean) => void;
}

export function HoldingInputs(props: HoldingInputsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  
  async function fetchCategories() {
    props.setIsLoading(true);
    const response = await getAllHoldingCategories();
    if (response.successful) {
      setCategories((response.data as Category[]).sort((a, b) => a.name.localeCompare(b.name)));
    }
    props.setIsLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <input
        id={`${HOLDING_ITEM_NAME_LOWERCASE}-id`}
        name={`${HOLDING_ITEM_NAME_LOWERCASE}-id`}
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
            id={`${HOLDING_ITEM_NAME_LOWERCASE}-name`}
            name={`${HOLDING_ITEM_NAME_LOWERCASE}-name`}
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
            id={`${HOLDING_ITEM_NAME_LOWERCASE}-type`}
            name={`${HOLDING_ITEM_NAME_LOWERCASE}-type`}
            value={props.editingFormData.type || HOLDING_TYPE_ASSET}
            onChange={props.onChange}
            className="select"
          >
            <option value={HOLDING_TYPE_ASSET}>{HOLDING_TYPE_ASSET}</option>
            <option value={HOLDING_TYPE_DEBT}>{HOLDING_TYPE_DEBT}</option>
          </select>
        }
      />
      <InputFieldSetTemplate 
        label="Category" 
        isRequired={true}
        inputChild={
          <div className="flex items-center gap-2">
            <select
              id={`${HOLDING_ITEM_NAME_LOWERCASE}-holdingCategoryId`}
              name={`${HOLDING_ITEM_NAME_LOWERCASE}-holdingCategoryId`}
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
              title={`Edit ${HOLDING_CATEGORY_ITEM_NAME_PLURAL}`}
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
            id={`${HOLDING_ITEM_NAME_LOWERCASE}-institution`}
            name={`${HOLDING_ITEM_NAME_LOWERCASE}-institution`}
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
