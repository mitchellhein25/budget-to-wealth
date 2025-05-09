"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-500 rounded-md"></div>
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900">Your App</h1>
          </div>
            <nav className="flex space-x-4">
              <a href="/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
              <a href="" className="text-gray-600 hover:text-gray-900"></a>
            </nav>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <a href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</a>
          <a href="/auth/logout" className="text-gray-600 hover:text-gray-900">Logout</a>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}