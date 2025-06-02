'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

interface IncomeCategoriesListProps {
  categories: CashFlowCategory[],
  onCategoryDeleted: () => void,
  isLoading: boolean,
  isError: boolean
}

export default function IncomeCategoriesList(props: IncomeCategoriesListProps) {
    const endpoint: string = "CashFlowCategories";
    const revalidatePath: string = "";

    async function handleDelete(id: number) {
        const result = await deleteRequest<CashFlowCategory>(endpoint, id);
        if (result.successful)
            props.onCategoryDeleted();
    };

    if (props.isError) {
        return (
            <p className="alert alert-error alert-soft">Failed to load income categories.</p>
        );
    }

    if (props.categories.length === 0) {
        return (
            <p className="alert alert-warning alert-soft">You haven’t added any income categories yet.</p>
        );
    }

    return (
        <div className="space-y-4 flex flex-col justify-center">
            <h2 className="text-lg">Income Categories</h2>
            <ul className="list">
                {props.categories.sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
                    <li key={category.id} className="list-row">
                        <div className="flex-1 mr-4">
                            <span>{category.name}</span>
                        </div>
                        <div className="flex space-x-2">
                            <>
                                <button
                                    id="delete-button"
                                    onClick={() => handleDelete(category.id as number)}
                                    className="p-1 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                                    aria-label="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
