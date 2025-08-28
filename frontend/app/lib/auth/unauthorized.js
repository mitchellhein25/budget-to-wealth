import { isAuthenticated } from '@/app/components/navbar/helpers/utils';

export function unauthorized(session) {
  if (!isAuthenticated(session)) {
    return (
      <div className="section-padding container-max">
        <div className="card bg-base-100 shadow-sm w-full max-w-md mx-auto">
          <div className="card-body p-6 text-center">
            <h2 className="card-title text-lg mb-4">Access Restricted</h2>
            <p>Please log in to access this page.</p>
            <a href="/auth/login" className="btn btn-primary mt-4">
              Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
