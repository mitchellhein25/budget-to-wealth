import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { cookies, headers } from 'next/headers';

export default async function Dashboard() {
  // Create a server request object to pass to getSession
  const headersList = headers();
  const cookieStore = cookies();
  
  // Mock request object with necessary properties for Auth0
  const requestHeaders = new Headers();
  (await headersList).forEach((value, key) => {
    requestHeaders.set(key, value);
  });
  
  const request = {
    headers: requestHeaders,
    cookies: {
      get: async (name: string) => {
        const cookie = (await cookieStore).get(name);
        return cookie ? { name: cookie.name, value: cookie.value } : undefined;
      }
    }
  } as any;
  
  const session = await auth0.getSession(request);
  
  if (!session) {
    redirect('/api/auth/login');
  }
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-4 text-lg text-gray-500">
        Welcome to your dashboard. This is a protected page only accessible to authenticated users.
      </p>
      
      {/* Add your dashboard content here */}
    </div>
  );
}