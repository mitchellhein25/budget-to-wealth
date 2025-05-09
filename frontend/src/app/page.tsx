"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth0-client';
import AuthButtons from '@/components/auth/AuthButtons';
import UserProfile from '@/components/auth/UserProfile';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SessionUser, SessionResponse } from '@/models/auth';

export default function Home() {
  const [session, setSession] = useState<{ user: SessionUser } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const userSession = await getSession();
        setSession(userSession);
      } catch (error) {
        console.error('Failed to get session:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Replace with your logo */}
              <div className="h-8 w-8 bg-blue-500 rounded-md"></div>
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900">Your App</h1>
          </div>
          {session && (
            <nav className="flex space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/settings" className="text-gray-600 hover:text-gray-900">Settings</a>
            </nav>
          )}
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {!session ? (
            <div className="bg-white shadow rounded-lg p-6 md:p-10">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Welcome to Your App
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  Get started by signing up or logging in to your account.
                </p>
                <div className="mt-8">
                  <AuthButtons />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <UserProfile user={session.user} />
            </div>
          )}
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