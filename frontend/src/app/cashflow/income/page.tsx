'use client'

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { auth0 } from '@/app/lib/auth/auth0';
import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import CashflowSideBar from '@/app/ui/components/cashflow/CashflowSideBar'
import IncomeCategoriesForm from '@/app/ui/components/cashflow/income/IncomeCategoriesForm';
import IncomeCategoriesList from '@/app/ui/components/cashflow/income/IncomeCategoriesList';
import { SessionData } from '@auth0/nextjs-auth0/types';
import React, { useEffect, useState } from 'react'

export default function Income(isLoggedIn: boolean) {

    const [incomeCategories, setIncomeCategories] = useState<CashFlowCategory[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const endpoint: string = "CashFlowCategories?cashFlowType=Income";

    useEffect(() => {
        fetchIncomeCategories();
    }, []);

    async function fetchIncomeCategories() {
        setIsLoading(true);
        const response = await getRequest<CashFlowCategory>(endpoint);
        setIncomeCategories(response.data as CashFlowCategory[]);
        if (!response.successful) {
            setIsError(true);
        }
        setIsLoading(false);
    }


    if (!isLoggedIn)
        return <></>;

    return (
        <div className="flex gap-6 p-6">
            <CashflowSideBar />
            <IncomeCategoriesForm onCategoryAdded={fetchIncomeCategories} />
            <IncomeCategoriesList
                categories={incomeCategories}
                onCategoryDeleted={fetchIncomeCategories}
                isLoading={isLoading}
                isError={isError}
            />
        </div>
    )
}
