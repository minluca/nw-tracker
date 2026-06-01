import { getLastFiveTransactions } from "@/lib/db/transactions";
import { getAccountsWithTransactions } from "@/lib/db/accounts";
import getAuthenticatedUser from "../lib/auth";
import TransactionList from "@/components/TransactionList";
import { getAssetOrderByAccountIds } from "@/lib/db/assets";
import { calculateLiquidity, calculateInvestments } from "@/lib/calculations";
import { getLastMonthlySnapshot } from "@/lib/db/snapshots";
import NetWorthCard from "@/components/NetWorthCard";
import AddTransactionButton from "@/components/AddTransactionButton";

export default async function Home() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const transactions = await getLastFiveTransactions(user.id);

  const accounts = await getAccountsWithTransactions(user.id);
  const assetOrders = await getAssetOrderByAccountIds(
    accounts.map((a) => a.id),
  );

  const liquidity = calculateLiquidity(accounts);
  const investments = calculateInvestments(assetOrders);
  const totalNw = liquidity + investments;
  const lastSnapshot = await getLastMonthlySnapshot(user.id);
  const previousMonthDelta = lastSnapshot
    ? Math.round((totalNw - Number(lastSnapshot.totalNw)) * 100) / 100
    : null;

  return (
    <main className="p-4 flex flex-col gap-4">
      <AddTransactionButton></AddTransactionButton>
      <NetWorthCard
        liquidity={liquidity}
        investments={investments}
        totalNw={totalNw}
        previousMonthDelta={previousMonthDelta}
      />
      <TransactionList transactions={transactions} />
    </main>
  );
}
