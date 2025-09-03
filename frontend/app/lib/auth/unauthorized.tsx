import { AlertTriangle } from 'lucide-react';
import { SessionData } from '@auth0/nextjs-auth0/types';

export const isTokenExpired = (session: SessionData | null): boolean => {
  return session?.tokenSet?.expiresAt
    ? session.tokenSet.expiresAt * 1000 < Date.now()
    : false;
};

export const isAuthenticated = (session: SessionData | null): boolean => {
  return (session ?? false) && !isTokenExpired(session);
};

export function unauthorized(session: SessionData | null) {

  if (!isAuthenticated(session)) {
    return (
      <div className="section-padding container-max flex items-center justify-center min-h-[60vh]">
        <div className="card bg-base-100 shadow-lg w-full max-w-md mx-auto">
          <div className="card-body p-3 sm:p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-error mb-3 sm:mb-4" />
            <h2 className="text-xl font-semibold text-error mb-3">Access Restricted</h2>
            <p className="text-base-content/70">Please log in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
