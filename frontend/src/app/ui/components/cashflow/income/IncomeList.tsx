'use client'

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowEntry } from '@/app/lib/models/CashFlowEntry';
import React, { useEffect, useState } from 'react'

export default function IncomeList({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [incomeEntries, setIncomeEntries] = useState<CashFlowEntry[]>([]);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function fetchIncomeEntries() {
        const response = await getRequest<CashFlowEntry>("CashFlowEntries?entryType=income");
        setIncomeEntries(response.data as CashFlowEntry[]);
        if (!response.successful) {
          setErrorMessage(response.responseMessage);
          setIsError(true);
        }
      }
    
      useEffect(() => {
        fetchIncomeEntries();
      }, []);

    if (isError) {
        return (
        <div className="p-5 rounded-xl bg-red-100/60 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-800 dark:text-red-300 shadow-sm">
            <h2 className="text-lg font-semibold">Failed to load income entries.</h2>
            <p className="text-sm mt-1">{errorMessage}</p>
        </div>
        );
    }

    if (incomeEntries.length === 0) {
        return (
        <div className="p-5 rounded-xl bg-yellow-100/60 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300 shadow-sm">
            <h2 className="text-lg font-semibold">No income entries found</h2>
            <p className="text-sm mt-1">You haven’t added any income entries yet.</p>
        </div>
        );
    }

    return (
        <div className="space-y-3">
            {incomeEntries.map((incomeEntry) => (
                <div key={incomeEntry.id} className="flex items-center justify-between py-2">
                    <span className="text-gray-300">{incomeEntry.categoryId}</span>
                    <span className="text-gray-300">{incomeEntry.amount}</span>
                    <span className="text-gray-300">{incomeEntry.date}</span>
                    <span className="text-gray-300">{incomeEntry.description}</span>
                    <div className="flex gap-2">
                        <button className="text-yellow-400">✏️</button>
                        <button className="text-red-400">🗑️</button>
                        <button className="text-yellow-400">✅</button>
                    </div>
                </div>
            ))}
        </div>
    )
}
