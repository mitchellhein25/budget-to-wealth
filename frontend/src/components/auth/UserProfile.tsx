import { useState } from 'react';
import { SessionUser } from '@/models/auth';

interface UserProfileProps {
  user: SessionUser;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  const handleLogout = (): void => {
    setIsLoggingOut(true);
    window.location.href = '/api/auth/logout';
  };

  return (
    <div className="divide-y divide-gray-200">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name || 'User profile'}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
        <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">User ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.sub}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email verified</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {user.email_verified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not verified
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last login</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {user.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}
            </dd>
          </div>
        </dl>
      </div>
      
      <div className="px-4 py-5 sm:px-6 flex justify-end">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </button>
      </div>
    </div>
  );
}