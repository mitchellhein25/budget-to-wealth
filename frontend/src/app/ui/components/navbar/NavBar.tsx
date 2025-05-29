import React from 'react'
import { SessionData } from "@auth0/nextjs-auth0/types";

export default function NavBar({ session }: { session: SessionData | null }) {
  return (
    <nav className="flex items-center justify-between gap-6 px-6 py-4 border-b border-gray-600">
        <div></div> 
        
        <div className="flex items-center gap-6">
            <div className="bg-yellow-400 text-black px-4 py-2 rounded text-sm font-medium">
            <a href="/cashflow" className="text-gray-800">Cashflow</a>
            </div>
            <div>
            <a href="/net-worth" className="text-gray-100 hover:text-gray-300">Net Worth</a>
            </div>
            <div>
            <a href="/dashboards" className="text-gray-100 hover:text-gray-300">Dashboards</a>
            </div>
        </div>

        {session ? (
            <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-full"></div>
                <span className="font-medium text-gray-100">
                {session.user.name ?? "User"}
                </span>
            </div>
            <a href="/auth/logout">
                <button className="text-red-500 font-bold hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors">
                Logout
                </button>
            </a>
            </div>
        ) : (
            <a href="/auth/login">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors">
                Login/Sign Up
            </button>
            </a>
        )}
    </nav>
  )
}
