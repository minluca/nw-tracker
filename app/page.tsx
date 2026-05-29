import getAuthenticatedUser from "../lib/auth";

export default async function Home() {
  const user = await getAuthenticatedUser();
  console.log("[PAGE] user:", user);
  return (
    <main>
      <h1>NW Tracker</h1>
    </main>
  );
}
