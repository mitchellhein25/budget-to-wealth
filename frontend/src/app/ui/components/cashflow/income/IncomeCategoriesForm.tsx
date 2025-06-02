'use client'

import React, { useState } from 'react'
import { postRequest } from '@/app/lib/api/rest-methods/postRequest';
import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import Form from 'next/form';

interface IncomeCategoriesFormProps {
  onCategoryAdded: () => void;
}

export default function IncomeCategoriesForm({ onCategoryAdded }: IncomeCategoriesFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);


    const nameField: string = 'Name';
    const endpoint: string = 'CashFlowCategories';

    async function handlePost(formData: FormData) {
        setName('');
        const nameValue = formData.get(nameField) as string;
        const cashFlowEntry: CashFlowCategory = { name: nameValue,  categoryType: CashFlowType.Income};
        const response = await postRequest<CashFlowCategory>(endpoint, cashFlowEntry);
        if (!response.successful) 
          setMessage("Failed to create income entry: " + response.responseMessage);
        else {
          setMessage("Income entry created successfully.");
          onCategoryAdded();
        }
    }

  return (
    <Form action={handlePost} className="space-y-4 flex flex-col justify-center w-xs">
      <h2 className="text-lg font-bold text-center">New Income Category</h2>
      <label htmlFor="Name" className="label">
        Name
      </label>
      <input
        id="Name"
        name="Name"
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input w-full"
      />
      <div className='flex justify-center'>
        <button
          type="submit"
          className="btn btn-secondary"
        >
        Create
        </button>
      </div>
      {message && (
        <p className="alert alert-error alert-soft">{message}</p>
      )}
    </Form>
  )
}
