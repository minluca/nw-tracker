import AccountList from "@/components/AccountList";
import AddAccountButton from "@/components/AddAccountButton";
import getAuthenticatedUser from "@/lib/auth";
import { getUserAccounts } from "@/lib/db/accounts";

export default async function Settings() {
  // --- Authentication ---
  const user = await getAuthenticatedUser();
  if (!user) return null;

  // --- Data fetching ---
  const accounts = await getUserAccounts(user.id);

  return (
    <main className="p-4 flex flex-col gap-4">
      <h1>Account</h1>
      <AccountList accounts={accounts}></AccountList>
      <AddAccountButton></AddAccountButton>
    </main>
  );
}
