import { withAuth } from "@/lib/api";
import {
  createTransaction,
  getLastFiveTransactions,
} from "@/lib/db/transactions";
import { transactionPost } from "@/lib/validators/transactions";
import { NextRequest, NextResponse } from "next/server";

/**
 * Returns the last 5 transactions for the authenticated user.
 *
 * @returns 200 with transaction list, 401 if unathorized, 500 on database error.
 */
export async function GET(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const transactions = await getLastFiveTransactions(user.id);
      return NextResponse.json(transactions);
    } catch (e) {
      return NextResponse.json(
        { error: "[TRANSACTIONS] Failed to fetch transactions" },
        { status: 500 },
      );
    }
  });
}

/**
 * Creates a new transaction for the authenticated user.
 * Validates input with Zod before inserting.
 *
 * @returns 201 with created transaction, 400 if invalid input, 401 if unauthorized, 500 on database error.
 */
export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const validatedBody = transactionPost.safeParse(body);

      if (!validatedBody.success) {
        console.error(
          "[TRANSACTIONS] Invalid POST input:",
          validatedBody.error,
        );
        return NextResponse.json(
          { error: "[TRANSACTIONS] Invalid POST input" },
          { status: 400 },
        );
      }

      const transaction = await createTransaction({
        ...validatedBody.data, // object spread syntax
        date: validatedBody.data.date ?? new Date(),
      });
      console.log("[TRANSACTIONS] Transaction created:", transaction.id);

      return NextResponse.json(transaction, { status: 201 });
    } catch (e) {
      console.error("[TRANSACTIONS] Failed to insert transaction:", e);
      return NextResponse.json(
        { error: "[TRANSACTIONS] Failed to insert transaction" },
        { status: 500 },
      );
    }
  });
}
