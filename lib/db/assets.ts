import prisma from "../prisma";

/**
 * Fetches all asset orders for a given list of account IDs.
 * Includes the latest price for each asset, used to calculate portfolio value.
 *
 * @param accountIds - list of account IDs to filter by
 * @returns list of asset orders with asset and latest price
 * @throws if the database query fails
 */
export async function getAssetOrderByAccountIds(accountIds: string[]) {
  try {
    return await prisma.assetOrder.findMany({
      where: {
        accountId: {
          in: accountIds,
        },
      },
      select: {
        deltaUnits: true,
        assetId: true,
        asset: {
          select: {
            assetPrices: {
              orderBy: { fetchedAt: "desc" },
              take: 1,
              select: { price: true },
            },
          },
        },
      },
    });
  } catch (e) {
    console.error("[DB] Failed to fetch asset orders:", e);
    throw new Error("[DB] Failed to fetch asset orders: " + e);
  }
}
