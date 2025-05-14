'use client';
import { putExpenseCategories } from '@/app/lib/api/expense-categories/putExpenseCategories';
import React from 'react';
import ListTemplate from '../list-template/ListTemplate';
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';

type ExpenseCategoriesListClientProps = {
  expenseCategories: ExpenseCategory[];
  errorMessage: string;
  isError: boolean;
}

export default function ExpenseCategoriesListClient(props: ExpenseCategoriesListClientProps) {
  return (
    <ListTemplate 
      items={props.expenseCategories}
      itemName="Expense Categories"
      errorMessage={props.errorMessage}
      isError={props.isError}
      onEdit={
        (editedCategory: ExpenseCategory) => putExpenseCategories(editedCategory)
      }
      onDelete={() => {}}
    />
  );
}
