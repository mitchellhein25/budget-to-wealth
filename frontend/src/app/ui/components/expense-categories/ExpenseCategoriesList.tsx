import { getExpenseCategories } from '@/app/lib/api/expense-categories/getExpenseCategories';
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';
import React from 'react';

export default async function ExpenseCategoriesList() {
  let categories: ExpenseCategory[] = [];

  let error = false;
  let errorMessage = '';
  const { data, responseMessage, successful } = await getExpenseCategories();
  categories = data;
  if (!successful) {
    errorMessage = responseMessage;
    error = true;
  }

  if (error) {
    return (
      <div className="p-5 rounded-xl bg-red-100/60 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-800 dark:text-red-300 shadow-sm">
        <h2 className="text-lg font-semibold">Failed to load categories</h2>
        <p className="text-sm mt-1">{errorMessage}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-yellow-100/60 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300 shadow-sm">
        <h2 className="text-lg font-semibold">No Categories Found</h2>
        <p className="text-sm mt-1">You haven’t added any expense categories yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Expense Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
