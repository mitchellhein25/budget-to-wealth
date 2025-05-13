'use client';
import React, { useState } from 'react';
import { postExpenseCategories } from '@/app/lib/api/expense-categories/postExpenseCategories';
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';
import FormTemplate from '../form-template/FormTemplate';

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
    <FormTemplate 
      title='Add a new Expense Category'
      buttonText='Create'
      inputFields={[
        {
          labelString: 'Name',
          type: 'text',
          value: name,
          setValue: setName
        }
      ]}
      formMessage={message}
      handleSubmit={handleSubmit}
      />
  );
}
