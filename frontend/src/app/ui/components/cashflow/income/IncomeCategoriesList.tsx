'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function IncomeCategoriesList() {
    const [incomeCategories, setIncomeCategories] = useState<CashFlowCategory[]>([]);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const nameField: string = "Name";
    const endpoint: string = "CashFlowCategories?cashFlowType=Income";
    const revalidatePath: string = "";

    useEffect(() => {
        fetchIncomeCategories();
    }, []);

    async function fetchIncomeCategories() {
        const response = await getRequest<CashFlowCategory>(endpoint);
        setIncomeCategories(response.data as CashFlowCategory[]);
        if (!response.successful) {
            setErrorMessage(response.responseMessage);
            setIsError(true);
        }
    }

    async function handleDelete(id: number) {
        await deleteRequest<CashFlowCategory>(endpoint, id, revalidatePath);
        // setExpenseCategories(prev => prev.filter(cat => cat.id !== id));
      };

    if (isError) {
        return (
            <p className="alert alert-error alert-soft">Failed to load income categories: {errorMessage}</p>
        );
    }

    if (incomeCategories.length === 0) {
        return (
            <p className="alert alert-warning alert-soft">You haven’t added any income categories yet.</p>
        );
    }

    return (
        <div className="space-y-4 flex flex-col justify-center">
            <h2 className="text-lg">Income Categories</h2>
            <ul className="list">
                {incomeCategories.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                    <li key={item.id} className="list-row">
                        <div className="flex-1 mr-4">
                            <span>{item.name}</span>
                        </div>
                        <div className="flex space-x-2">
                            <>
                                <button
                                    id="delete-button"
                                    onClick={() => handleDelete(item.id as number)}
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
