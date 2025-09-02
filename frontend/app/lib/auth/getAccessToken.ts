import { auth0 } from "@/app/lib/auth";

export async function getAccessToken(): Promise<string | undefined> {
  const session = await auth0.getSession();
  return session?.tokenSet?.accessToken;
}