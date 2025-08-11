import { auth0 } from "./auth0";

export async function getAccessToken(): Promise<string | undefined> {
  const session = await auth0.getSession();
  return session?.tokenSet?.accessToken;
}