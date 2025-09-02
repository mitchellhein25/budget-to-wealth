'use client';

import React, { useEffect, useState } from 'react'
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { InputFieldSetTemplate } from '@/app/components/form';
import { Category } from '@/app/components/categories/Category';
import { getAllHoldingCategories } from '@/app/lib/api';
import { HOLDING_CATEGORY_ITEM_NAME_LINK, HOLDING_CATEGORY_ITEM_NAME_PLURAL, HOLDING_ITEM_NAME_LOWERCASE, HOLDING_ITEM_NAME_LOWERCASE_PLURAL, HOLDING_TYPE_ASSET, HOLDING_TYPE_DEBT, HoldingFormData } from '..';
import { HOLDING_SNAPSHOT_ITEM_NAME_LINK, NET_WORTH_ITEM_NAME_LINK } from '../../../components';

interface HoldingInputsProps {
  editingFormData: Partial<HoldingFormData>;
  onChange: React.ChangeEventHandler;
  setIsLoading: (isLoading: boolean) => void;
}

export function HoldingInputs({ editingFormData, onChange, setIsLoading }: HoldingInputsProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      const response = await getAllHoldingCategories();
      if (response.successful) {
        setCategories((response.data as Category[]).sort((a, b) => a.name.localeCompare(b.name)));
      }
      setIsLoading(false);
    }
    fetchCategories();
  }, [setIsLoading]);

  return (
    <>
      <input
        id={`${HOLDING_ITEM_NAME_LOWERCASE}-id`}
        name={`${HOLDING_ITEM_NAME_LOWERCASE}-id`}
        readOnly
        type="text"
        value={editingFormData?.id ?? ''}
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
            value={editingFormData?.name ?? ""}
            onChange={onChange}
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
            value={editingFormData.type || HOLDING_TYPE_ASSET}
            onChange={onChange}
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
              value={editingFormData.holdingCategoryId || ""}
              onChange={onChange}
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
              href={`/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_SNAPSHOT_ITEM_NAME_LINK}/${HOLDING_ITEM_NAME_LOWERCASE_PLURAL}/${HOLDING_CATEGORY_ITEM_NAME_LINK}`}
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
            value={editingFormData.institution ?? ""}
            onChange={onChange}
            className="input m-0 w-full"
          />
        }
      />
    </>
  )
}
