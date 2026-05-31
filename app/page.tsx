import getAuthenticatedUser from "../lib/auth";

export default async function Home() {
  const user = await getAuthenticatedUser();
  return (
    <main>
      <h1>NW Tracker</h1>
    </main>
  );
}
