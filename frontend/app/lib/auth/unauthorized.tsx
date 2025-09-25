import { SessionData } from '@auth0/nextjs-auth0/types';

export function isTokenExpired(session: SessionData | null): boolean {
  return session?.tokenSet?.expiresAt
    ? session.tokenSet.expiresAt * 1000 < Date.now()
    : false;
};

export function isAuthenticated(session: SessionData | null): boolean {
  return (session ?? false) && !isTokenExpired(session);
};

export function unauthorized(session: SessionData | null) {

  if (!isAuthenticated(session)) {
    return (
      <div className="section-padding container-max flex items-center justify-center min-h-[60vh]">
        <div className="card bg-base-100 shadow-lg w-full max-w-md mx-auto">
          <div className="card-body p-6 sm:p-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-4">
              Welcome to Budget to Wealth
            </h1>
            <p className="text-base-content/70 mb-6 text-base sm:text-lg">
              Take control of your financial future. Sign in to track your cash flow, manage your net worth, and build lasting wealth.
            </p>
            <a 
              href="/auth/login" 
              className="btn btn-primary btn-lg w-full"
            >
              Sign In to Get Started
            </a>
            <p className="text-sm text-base-content/50 mt-4">
              New to Budget to Wealth? Signing in will create your account automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
