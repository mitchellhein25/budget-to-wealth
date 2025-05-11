import { getExpenseCategories } from '@/api/expense-categories/getExpenseCategories';
import { ExpenseCategory } from '@/models/ExpenseCategory';
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
      <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 shadow">
        <h2 className="text-lg font-semibold">Failed to load categories</h2>
        <p className="text-sm mt-1">{errorMessage}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 shadow">
        <h2 className="text-lg font-semibold">No Categories Found</h2>
        <p className="text-sm mt-1">You haven’t added any expense categories yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border border-gray-200 shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Expense Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100 transition"
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
