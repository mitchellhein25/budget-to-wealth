import type { Metadata } from "next";
import "./globals.css";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { auth0 } from "./lib/auth/auth0";
import NavBar from "./ui/components/NavBar";

export const metadata: Metadata = {
  title: "Budget to Wealth",
  description: "Budget to Wealth App",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session: SessionData | null = await auth0.getSession();
  return (
    <html lang="en">
      <body>
        <header>
          <NavBar session={session} />
        </header>
        {children}
      </body>
    </html>
  );
}
