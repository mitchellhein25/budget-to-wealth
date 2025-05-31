import { auth0 } from '@/app/lib/auth/auth0';
import CashflowSideBar from '@/app/ui/components/cashflow/CashflowSideBar'
import IncomeList from '@/app/ui/components/cashflow/income/IncomeList'
import { SessionData } from '@auth0/nextjs-auth0/types';
import React from 'react'

export default async function Income() {
  const session: SessionData | null = await auth0.getSession();
  return (
    <div className="flex gap-6 p-6">
        <CashflowSideBar />
        <div className="flex-1 flex gap-6">
            <div className="flex-1 rounded-lg p-4">
                <IncomeList isLoggedIn={session == null} />

                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-800">
                    <button className="text-gray-400">← Previous</button>
                    <button className="bg-white text-black px-3 py-1 rounded">1</button>
                    <button className="text-gray-400 px-3 py-1">2</button>
                    <button className="text-gray-400 px-3 py-1">3</button>
                    <span className="text-gray-400">...</span>
                    <button className="text-gray-400 px-3 py-1">67</button>
                    <button className="text-gray-400 px-3 py-1">68</button>
                    <button className="text-gray-400">Next →</button>
                </div>
            </div>

            <div className="w-80 rounded-lg p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-2">Name</label>
                        <input
                            type="text"
                            placeholder="Value"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Surname</label>
                        <input
                            type="text"
                            placeholder="Value"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Value"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Message</label>
                        <textarea
                            placeholder="Value"
                            rows={4}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 resize-none"
                        />
                    </div>
                    <button className="w-full bg-gray-200 text-black py-2 rounded font-medium hover:bg-white transition-colors">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}
