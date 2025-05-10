import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-700">Budget To Wealth</h1>
              </div>
              <div>
                {session ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-100 p-2 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {session.user.name ?? "User"}
                      </span>
                    </div>
                    <a href="/auth/logout">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                        Logout
                      </button>
                    </a>
                    <nav className="flex space-x-4">
                      <a href="/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
                    </nav>
                  </div>
                ) : (
                  <a href="/auth/login">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                      Login/Sign Up
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          {/* your page content here */}
        </main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-lg font-bold">Budget To Wealth</h2>
                <p className="text-gray-400 text-sm mt-2">
                  © 2025 Budget To Wealth. All rights reserved.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 md:gap-16">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white text-sm">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white text-sm">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white text-sm">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white text-sm">
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
};