import { withAuth } from "@/lib/api";
import { calculateCashflow } from "@/lib/calculations";
import { getCurrentMonthCashflow } from "@/lib/db/cashflow";
import { NextRequest, NextResponse } from "next/server";

/**
 * Returns the cashflow summary for the current month.
 * Aggregates income and expenses across all accounts of the authenticated user.
 *
 * @returns 200 with { income, expenses }, 401 if unauthorized, 500 on database error.
 */
export async function GET(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const accountsWithCurrentMonthTransactions =
        await getCurrentMonthCashflow(user.id);

      const { income, expenses } = calculateCashflow(
        accountsWithCurrentMonthTransactions,
      );

      return NextResponse.json({
        income,
        expenses,
      });
    } catch (e) {
      console.error(
        "[CASHFLOW] Failed to fetch cashflow for current month: ",
        e,
      );
      return NextResponse.json(
        {
          error: "[CASHFLOWH] Failed to fetch cashflow for current month: " + e,
        },
        { status: 500 },
      );
    }
  });
}
