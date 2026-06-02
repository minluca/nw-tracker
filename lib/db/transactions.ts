import { TransactionType } from "../generated/prisma/enums";
import prisma from "../prisma";

/**
 * Fetches the last 5 transactions for a given user, ordered by date descending.
 *
 * @param userId - the internal database user ID
 * @returns list of transactions with category details
 * @throws if the database query fails
 */
export async function getLastFiveTransactions(userId: string) {
  try {
    return await prisma.transaction.findMany({
      where: {
        account: {
          userId: userId,
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
  } catch (e) {
    console.error("[DB] Failed to fetch transactions: ", e);
    throw new Error("[DB] Failed to fetch transactions: " + e);
  }
}

/**
 * Creates a new transaction in the database.
 *
 * @param input - transaction data (accountId, type, payee, amount, and optional fields)
 * @returns the created transaction record
 * @throws if the database insert fails
 */
export async function createTransaction(input: {
  accountId: string;
  type: TransactionType;
  payee: string;
  amount: number;
  categoryId?: string;
  memo?: string;
  date: Date;
}) {
  try {
    return await prisma.transaction.create({
      data: {
        accountId: input.accountId,
        type: input.type,
        payee: input.payee,
        amount: input.amount,
        categoryId: input.categoryId,
        memo: input.memo,
        date: input.date,
      },
    });
  } catch (e) {
    console.error("[DB] Failed to create transaction: ", e);
    throw new Error("[DB] Failed to create transaction: " + e);
  }
}
