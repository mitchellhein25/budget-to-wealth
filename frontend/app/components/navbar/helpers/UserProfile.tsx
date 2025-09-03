'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Import, User } from 'lucide-react';
import { SessionData } from '@auth0/nextjs-auth0/types';
import { isAuthenticated } from '@/app/lib/auth';

export function UserProfile({ session, pathname }: { session: SessionData | null, pathname: string }) {
  if (!isAuthenticated(session)) {
    return (
      <div className="navbar-end">
        <a href={`/auth/login?returnTo=${encodeURIComponent(pathname)}`} className="btn btn-primary">
          Login 
        </a>
      </div>
    );
  }
  
  return (
    <div className="navbar-end space-x-2">
      {pathname !== '/import' && (
        <Link
          href="/import"
          className="btn btn-ghost btn-circle hidden lg:flex"
          title="Import Data"
        >
          <Import className="w-5 h-5" />
        </Link>
      )}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full">
              {session?.user?.picture ? (
                <Image
                  src={session.user.picture}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="bg-primary text-primary-content rounded-full w-full h-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
          <span className="hidden sm:inline">{session?.user?.name ?? "User"}</span>
        </div>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><Link href="/profile">Profile</Link></li>
          <li><a href="/auth/logout">Logout</a></li>
        </ul>
      </div>
    </div>
  );
}