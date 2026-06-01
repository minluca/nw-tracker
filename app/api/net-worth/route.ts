import { withAuth } from "@/lib/api";
import { calculateInvestments, calculateLiquidity } from "@/lib/calculations";
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

      const liquidity = calculateLiquidity(accounts);

      const assetOrders = await getAssetOrderByAccountIds(
        accounts.map((a) => a.id),
      );

      const investments = calculateInvestments(assetOrders);

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
