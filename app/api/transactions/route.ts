import { withAuth } from "@/lib/api";
import prisma from "@/lib/prisma";
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
      const lastFiveTransactions = await prisma.transaction.findMany({
        where: {
          account: {
            userId: user.id,
          },
        },
        orderBy: { date: "desc" },
        take: 5,
        select: {
          id: true,
          date: true,
          payee: true,
          amount: true,
          currency: true,
          type: true,
          category: {
            select: {
              name: true,
              icon: true,
              color: true,
            },
          },
        },
      });

      return NextResponse.json(lastFiveTransactions);
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

      const transactionInsert = await prisma.transaction.create({
        data: {
          accountId: validatedBody.data.accountId,
          type: validatedBody.data.type,
          payee: validatedBody.data.payee,
          amount: validatedBody.data.amount,
          categoryId: validatedBody.data.categoryId,
          memo: validatedBody.data.memo,
          date: validatedBody.data.date ?? new Date(),
        },
      });
      console.log("[TRANSACTIONS] Transaction created:", transactionInsert.id);

      return NextResponse.json(transactionInsert, { status: 201 });
    } catch (e) {
      console.error("[TRANSACTIONS] Failed to insert transaction:", e);
      return NextResponse.json(
        { error: "[TRANSACTIONS] Failed to insert transaction" },
        { status: 500 },
      );
    }
  });
}
