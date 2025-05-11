'use client';

import React, { useState } from 'react';
import { postExpenseCategories } from '@/app/lib/api/expense-categories/postExpenseCategories';
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';
import Form from 'next/form';

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
    <Form
      action={handleSubmit}
      className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700 space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Add a new Expense Category</h2>
      <div>
        <label htmlFor="name" className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Create
      </button>
      {message && (
        <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">{message}</p>
      )}
    </Form>
  );
}
