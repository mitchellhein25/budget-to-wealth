'use client';

import React, { useState } from 'react';
import { postExpenseCategories } from '@/api/expense-categories/postExpenseCategories'
import { ExpenseCategory } from '@/models/ExpenseCategory';
import Form from 'next/form'

export default function ExpenseCategoriesForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setName('');
    const name = formData.get('name') as string;
    const expenseCategory: ExpenseCategory = { name };
    const { responseMessage, successful } = await postExpenseCategories(expenseCategory);
    if (!successful) 
      setMessage("Failed to create expense category: " + responseMessage);
    else
      setMessage("Expense category created successfully.");
  }

  return (
    <Form action={handleSubmit} className="space-y-4 p-4 border rounded-md shadow">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Expense Category Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create
      </button>
      {message && (
        <p className="text-sm mt-2 text-gray-700">{message}</p>
      )}
    </Form>
  )
}
