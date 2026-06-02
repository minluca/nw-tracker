import prisma from "../prisma";

/**
 * Fetches transactions for the current month across all accounts of a user.
 * Used to calculate income and expenses for the current month.
 *
 * @param userId - the internal database user ID
 * @returns list of accounts with current month transactions (amount and type)
 * @throws if the database query fails
 */
export async function getRunningMonthCashflow(userId: string) {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return await prisma.account.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        transactions: {
          where: {
            date: {
              gte: new Date(year, month - 1, 1), // first day of the month
              lt: new Date(year, month, 1), // first day of the month after
            },
            type: { in: ["income", "expense"] },
          },
          select: {
            amount: true,
            type: true,
          },
        },
      },
    });
  } catch (e) {
    console.error("[DB] Failed to fetch current month cashflow: ", e);
    throw new Error("[DB] Failed to fetch current month cashflow: " + e);
  }
}
