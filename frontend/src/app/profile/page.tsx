import { auth0 } from "@/app/lib/auth/auth0";

export default async function Profile() {
  const session = await auth0.getSession();
  return (
    <>
      {session?.user?.name && (
        <div style={{ textAlign: "center" }}>
          <img
            src={session?.user?.picture}
            alt="Profile"
            style={{ borderRadius: "50%", width: "80px", height: "80px" }}
          />
          <h2>{session?.user?.name}</h2>
          <p>{session?.user?.email}</p>
          <pre>{JSON.stringify(session?.user, null, 2)}</pre>
        </div>
      )}
    </>
  );
}