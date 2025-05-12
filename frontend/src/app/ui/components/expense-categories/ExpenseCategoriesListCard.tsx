'use client';
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';
import React from 'react';

export default function ExpenseCategoriesListCard({ item }: { item: ExpenseCategory }) {
  return (
    <p className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-200">{item.name}</p>
  );
}
