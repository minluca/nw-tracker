import prisma from "../prisma";

/**
 * Fetches the most recent monthly snapshot for a given user.
 * Used to calculate the delta between current net worth and last month.
 *
 * @param userId - the internal database user ID
 * @returns the most recent MonthlySnapshot, or null if none exists
 * @throws if the database query fails
 */
export async function getLastMonthlySnapshot(userId: string) {
  try {
    return await prisma.monthlySnapshot.findFirst({
      where: {
        userId: userId,
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
  } catch (e) {
    console.error("[DB] Failed to fetch last monthly snapshot:", e);
    throw new Error("[DB] Failed to fetch last monthly snapshot: " + e);
  }
}
