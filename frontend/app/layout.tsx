import type { Metadata } from "next";
import "./globals.css";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { auth0 } from "@/app/lib/auth";
import { NavBar, UnauthorizedWrapper } from "@/app/components";

export const metadata: Metadata = {
  title: "Budget to Wealth",
  description: "Budget to Wealth App",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session: SessionData | null = await auth0.getSession();
  return (
    <html>
      <body className="min-h-screen bg-base-100 overflow-x-hidden">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 bg-base-100/95 backdrop-blur-sm border-b border-base-300">
            <NavBar session={session} />
          </header>
          <main className="flex-1">
            <UnauthorizedWrapper session={session}>
              {children}
            </UnauthorizedWrapper>
          </main>
        </div>
      </body>
    </html>
  );
}
