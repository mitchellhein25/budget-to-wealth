import { auth0 } from '@/lib/auth0';
import React from 'react';

type Category = {
  id: number;
  name: string;
};

export default async function ExpenseCategoriesList() {
  const session = await auth0.getSession();
  const res = await fetch('http://localhost:5000/api/ExpenseCategories', {
    headers: {
      Authorization: `Bearer ${session?.tokenSet.accessToken}`,
    },
    cache: 'no-store', // Or use 'force-cache' if data rarely changes
  });
  console.log(res);
  if (!res.ok) {
    return <p className="text-red-500">Failed to load categories.</p>;
  }
  
  const categories: Category[] = await res.json();

  return (
    <div className="p-4 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Expense Categories</h2>
      <ul className="space-y-1">
        {categories.map((cat) => (
          <li key={cat.id} className="p-2 bg-gray-50 rounded">
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
