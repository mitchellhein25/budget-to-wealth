import { getExpenseCategories } from '@/app/lib/api/expense-categories/getExpenseCategories';
import React from 'react';
import ExpenseCategoriesListCard from './ExpenseCategoriesListCard';
import ListTemplate from '../ListTemplate';
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';

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
    <ListTemplate<ExpenseCategory> 
      items={expenseCategories}
      itemName="Expense Categories"
      itemCard={ExpenseCategoriesListCard}
      errorMessage={errorMessage}
      isError={isError}
    />
  );
}
