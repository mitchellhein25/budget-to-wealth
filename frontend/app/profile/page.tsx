import { auth0 } from "@/app/lib/auth/auth0";
import Image from "next/image";
import { User } from "lucide-react";

export default async function Profile() {
  const session = await auth0.getSession();
  
  // Debug logging
  console.log('Profile page - Session data:', JSON.stringify(session, null, 2));
  console.log('Profile page - User object:', session?.user ? JSON.stringify(session.user, null, 2) : 'No user');
  console.log('Profile page - User picture URL:', session?.user?.picture);
  
  if (!session?.user) {
    console.log('Profile page - No session or user, showing login prompt');
    return (
      <div className="section-padding container-max">
        <div className="card bg-base-100 shadow-sm w-full max-w-md mx-auto">
          <div className="card-body p-6 text-center">
            <h2 className="card-title text-lg mb-4">Profile</h2>
            <p>Please log in to view your profile.</p>
            <div className="mt-4 p-4 bg-base-200 rounded-lg text-left text-sm">
              <h4 className="font-semibold mb-2">Debug Info:</h4>
              <p>Session: {session ? 'Present' : 'Null'}</p>
              <p>User: {session?.user ? 'Present' : 'Null'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Profile page - Rendering profile for user:', session.user.name);
  
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="card bg-base-100 shadow-sm w-full max-w-xl">
        <div className="card-body p-8 flex flex-col items-center space-y-6">
          <div className="avatar">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {session.user.picture ? (
                <>
                  <Image
                    src={session.user.picture}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                    onError={(e) => {
                      console.error('Profile page - Image failed to load:', session.user.picture);
                      console.error('Profile page - Image error:', e);
                    }}
                    onLoad={() => {
                      console.log('Profile page - Image loaded successfully:', session.user.picture);
                    }}
                  />
                  <div className="mt-2 text-xs text-center text-base-content/70">
                    Picture URL: {session.user.picture}
                  </div>
                </>
              ) : (
                <div className="bg-primary text-primary-content rounded-full w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16" />
                </div>
              )}
            </div>
          </div>
          <div className="text-center space-y-4 w-full">
            <h3 className="text-xl font-semibold">{session.user.name}</h3>
            <p className="text-base-content/70">{session.user.email}</p>
            <a href="/auth/logout" className="btn btn-error mx-auto">
              Logout
            </a>
          </div>
          
          {/* Debug section */}
          <div className="w-full mt-6 p-4 bg-base-200 rounded-lg text-left text-sm">
            <h4 className="font-semibold mb-2">Debug Information:</h4>
            <div className="space-y-1">
              <p><strong>User ID:</strong> {session.user.sub || 'Not available'}</p>
              <p><strong>Name:</strong> {session.user.name || 'Not available'}</p>
              <p><strong>Email:</strong> {session.user.email || 'Not available'}</p>
              <p><strong>Picture:</strong> {session.user.picture || 'Not available'}</p>
              <p><strong>Session Token:</strong> {session.tokenSet?.accessToken ? 'Present' : 'Not available'}</p>
              <p><strong>Session Expires:</strong> {session.tokenSet?.expiresAt ? new Date(session.tokenSet.expiresAt * 1000).toISOString() : 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
