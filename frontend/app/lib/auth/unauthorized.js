import { isAuthenticated } from '@/app/components/navbar/helpers/utils';
import { AlertTriangle } from 'lucide-react';

export function unauthorized(session) {

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
