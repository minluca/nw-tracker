import { getLastFiveTransactions } from "@/lib/db/transactions";
import getAuthenticatedUser from "../lib/auth";
import TransactionList from "@/components/TransactionList";

export default async function Home() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const transactions = await getLastFiveTransactions(user.id);

  return (
    <main>
      <TransactionList transactions={transactions}></TransactionList>
    </main>
  );
}
