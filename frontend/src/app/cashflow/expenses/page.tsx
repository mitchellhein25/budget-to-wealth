// import { auth0 } from '@/app/lib/auth/auth0';
import CashflowSideBar from '@/app/ui/components/cashflow/CashflowSideBar'
// import ExpenseCategories from '@/app/ui/components/expense-categories/ExpenseCategories'
// import { SessionData } from '@auth0/nextjs-auth0/types';
import React from 'react'

export default async function Expenses() {
  // const session: SessionData | null = await auth0.getSession();
  return (
    <div className="flex gap-6 p-6">
        <CashflowSideBar />
        {/* <ExpenseCategories isLoggedIn={session != null} /> */}
    </div>
  )
}
