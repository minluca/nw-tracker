import prisma from "../prisma";

/**
 * Fetches all accounts for a given user, including their transactions.
 * Used to calculate liquidity (openingBalance + income - expenses).
 *
 * @param userId - the internal database user ID
 * @returns list of accounts with transactions (amount and type)
 * @throws if the database query fails
 */
export async function getAccountsWithTransactions(userId: string) {
  try {
    return await prisma.account.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        openingBalance: true,
        transactions: {
          select: {
            amount: true,
            type: true,
          },
        },
      },
    });
  } catch (e) {
    console.error("[DB] Failed to fetch accounts with transactions:", e);
    throw new Error("[DB] Failed to fetch accounts with transactions: " + e);
  }
}
