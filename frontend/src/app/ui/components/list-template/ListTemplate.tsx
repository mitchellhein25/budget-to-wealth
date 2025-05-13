import React from 'react';
import ListCardTemplate, { ListCardTemplateProps } from './ListCardTemplate';

type ListTemplateProps<T> = {
  items: T[];
  itemName: string,
  isError?: boolean;
  errorMessage?: string;
}

export default function ListTemplate<T extends ListCardTemplateProps>(props: ListTemplateProps<T>) {

  if (props.isError) {
    return (
      <div className="p-5 rounded-xl bg-red-100/60 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-800 dark:text-red-300 shadow-sm">
        <h2 className="text-lg font-semibold">Failed to load {props.itemName.toLocaleLowerCase()}</h2>
        <p className="text-sm mt-1">{props.errorMessage}</p>
      </div>
    );
  }

  if (props.items.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-yellow-100/60 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300 shadow-sm">
        <h2 className="text-lg font-semibold">No {props.itemName} Found</h2>
        <p className="text-sm mt-1">You haven’t added any {props.itemName} yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{props.itemName}</h2>
      <ul className="space-y-2">
        {props.items.map((item, idx) => (
          <li key={idx}>
            <ListCardTemplate name={item.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
