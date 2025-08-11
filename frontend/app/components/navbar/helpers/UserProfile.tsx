'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Import, User } from 'lucide-react';
import { isAuthenticated } from './utils';
import { SessionData } from '@auth0/nextjs-auth0/types';

export function UserProfile({ session, pathname }: { session: SessionData | null, pathname: string }) {
  useEffect(() => {
    console.log('UserProfile - Component mounted with session:', session ? 'Present' : 'Null');
    if (session?.user) {
      console.log('UserProfile - User data:', {
        name: session.user.name,
        email: session.user.email,
        picture: session.user.picture,
        sub: session.user.sub
      });
    }
  }, [session]);

  if (!isAuthenticated(session)) {
    console.log('UserProfile - User not authenticated, showing login button');
    return (
      <div className="navbar-end">
        <a href="/auth/login" className="btn btn-primary">
          Login 
        </a>
      </div>
    );
  }

  console.log('UserProfile - User authenticated, rendering profile dropdown');
  
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
                <>
                  <Image
                    src={session.user.picture}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    onError={(e) => {
                      console.error('UserProfile - Avatar image failed to load:', session.user.picture);
                      console.error('UserProfile - Image error:', e);
                    }}
                    onLoad={() => {
                      console.log('UserProfile - Avatar image loaded successfully:', session.user.picture);
                    }}
                  />
                  <div className="hidden">
                    Debug: Picture URL = {session.user.picture}
                  </div>
                </>
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