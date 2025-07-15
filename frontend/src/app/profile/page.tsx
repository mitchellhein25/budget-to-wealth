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
    <div className="section-padding container-max">
      <div className="card bg-base-100 shadow-sm w-full max-w-md mx-auto">
        <div className="card-body p-6">
          <h2 className="card-title text-lg mb-6 text-center">Profile</h2>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {session.user.picture ? (
                  <Image
                    src={session.user.picture}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-primary text-primary-content rounded-full w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{session.user.name}</h3>
              <p className="text-base-content/70">{session.user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
