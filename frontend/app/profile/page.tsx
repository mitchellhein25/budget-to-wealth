import { auth0 } from "@/app/lib/auth/auth0";
import Image from "next/image";
import { User } from "lucide-react";

export default async function Profile() {
  const session = await auth0.getSession();
  
  if (!session?.user) {
    return (
      <div className="section-padding container-max">
        <div className="card bg-base-100 shadow-sm w-full max-w-md mx-auto">
          <div className="card-body p-6 text-center">
            <h2 className="card-title text-lg mb-4">Profile</h2>
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }
  
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
                  />
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
        </div>
      </div>
    </div>
  );
}
