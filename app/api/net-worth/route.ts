import { withAuth } from "@/lib/api";
import { getAccountsWithTransactions } from "@/lib/db/accounts";
import { getAssetOrderByAccountIds } from "@/lib/db/assets";
import { getLastMonthlySnapshot } from "@/lib/db/snapshots";
import { NextRequest, NextResponse } from "next/server";

/**
 * Returns the current net worth breakdown for the authenticated user.
 * Includes liquidity (cash accounts) and investments (asset portfolio).
 *
 * @returns 200 with { liquidity, investments, totalNw, delta }, 401 if unauthorized, 500 on database error.
 */
export async function GET(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const accounts = await getAccountsWithTransactions(user.id);

      // Calculate liquidity: for each account, sum openingBalance + income - expenses
      const liquidity = accounts.reduce((total, account) => {
        const transactionSum = account.transactions.reduce((sum, tx) => {
          return tx.type === "income"
            ? sum + Number(tx.amount)
            : sum - Number(tx.amount);
        }, 0);
        return total + Number(account.openingBalance) + transactionSum;
      }, 0);

      const assetOrders = await getAssetOrderByAccountIds(
        accounts.map((a) => a.id),
      );

      // Calculate investment value: SUM(deltaUnits * latestPrice) for each asset order
      const investments = assetOrders.reduce((total, order) => {
        const price = Number(order.asset.assetPrices[0]?.price ?? 0);
        const units = Number(order.deltaUnits);
        return total + price * units;
      }, 0);

      const totalNw = liquidity + investments;

      const lastSnapshot = await getLastMonthlySnapshot(user.id);

      // Calculate delta vs last monthly snapshot (null if no snapshot exists)
      const previousMonthDelta = lastSnapshot
        ? Math.round((totalNw - Number(lastSnapshot.totalNw)) * 100) / 100
        : null;

      return NextResponse.json({
        liquidity,
        investments,
        totalNw,
        previousMonthDelta,
      });
    } catch (e) {
      console.error("[NET-WORTH] Failed to fetch net worth:", e);
      return NextResponse.json(
        { error: "[NET-WORTH] Failed to fetch net worth" },
        { status: 500 },
      );
    }
  });
}
