'use server'

import { auth0 } from "@/app/lib/auth/auth0";

export async function getAccessToken(): Promise<string | undefined> {
  const session = await auth0.getSession();
  return session?.tokenSet?.accessToken;
}