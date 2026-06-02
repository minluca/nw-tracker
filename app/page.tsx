import { getLastFiveTransactions } from "@/lib/db/transactions";
import { getAccountsWithTransactions } from "@/lib/db/accounts";
import { getAssetOrderByAccountIds } from "@/lib/db/assets";
import { getLastMonthlySnapshot } from "@/lib/db/snapshots";
import { getRunningMonthCashflow } from "@/lib/db/cashflow";
import {
  calculateLiquidity,
  calculateInvestments,
  calculateCashflow,
} from "@/lib/calculations";
import getAuthenticatedUser from "../lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import Greeting from "@/components/Greeting";
import AddTransactionButton from "@/components/AddTransactionButton";
import NetWorthCard from "@/components/NetWorthCard";
import CashflowCard from "@/components/CashflowCard";
import TransactionList from "@/components/TransactionList";

export default async function Home() {
  // --- Authentication ---
  const user = await getAuthenticatedUser();
  if (!user) return null;
  const clerkUser = await currentUser();
  const firstName = clerkUser?.firstName ?? user.email.split("@")[0];

  // --- Data fetching ---
  const recentTransactions = await getLastFiveTransactions(user.id);
  const accountsWithTransactions = await getAccountsWithTransactions(user.id);
  const assetOrdersWithPrices = await getAssetOrderByAccountIds(
    accountsWithTransactions.map((a) => a.id),
  );
  const accountsWithRunningMonthTransactions = await getRunningMonthCashflow(
    user.id,
  );
  const lastMonthlySnapshot = await getLastMonthlySnapshot(user.id);

  // --- Net worth calculations ---
  const liquidity = calculateLiquidity(accountsWithTransactions);
  const investmentsValue = calculateInvestments(assetOrdersWithPrices);
  const totalNetWorth = liquidity + investmentsValue;
  const netWorthDeltaVsLastMonth = lastMonthlySnapshot
    ? Math.round((totalNetWorth - Number(lastMonthlySnapshot.totalNw)) * 100) /
      100
    : null;

  // --- Cashflow calculations ---
  const { income: monthlyIncome, expenses: monthlyExpenses } =
    calculateCashflow(accountsWithRunningMonthTransactions);

  return (
    <main className="p-4 flex flex-col gap-4">
      <Greeting firstName={firstName} />
      <AddTransactionButton />
      <NetWorthCard
        liquidity={liquidity}
        investments={investmentsValue}
        totalNw={totalNetWorth}
        previousMonthDelta={netWorthDeltaVsLastMonth}
      />
      <CashflowCard income={monthlyIncome} expenses={monthlyExpenses} />
      <TransactionList transactions={recentTransactions} />
    </main>
  );
}
