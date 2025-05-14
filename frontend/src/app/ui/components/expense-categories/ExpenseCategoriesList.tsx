import { getExpenseCategories } from '@/app/lib/api/expense-categories/getExpenseCategories';
import React from 'react';
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';
import ExpenseCategoriesListClient from './ExpenseCategoriesListClient';

export default async function ExpenseCategoriesList() {
  let expenseCategories: ExpenseCategory[] = [];

  let isError = false;
  let errorMessage = '';
  const { data, responseMessage, successful } = await getExpenseCategories();
  expenseCategories = data;
  if (!successful) {
    errorMessage = responseMessage;
    isError = true;
  }
  return (
    <ExpenseCategoriesListClient 
      expenseCategories={expenseCategories}
      errorMessage={errorMessage}
      isError={isError}
    />
  );
}
