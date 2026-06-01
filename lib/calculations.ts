/**
 * Calculates total liquidity across all accounts.
 * For each account: openingBalance + SUM(income) - SUM(expenses).
 */
export function calculateLiquidity(accounts: any[]): number {
  return accounts.reduce((total, account) => {
    const transactionSum = account.transactions.reduce((sum, tx) => {
      return tx.type === "income"
        ? sum + Number(tx.amount)
        : sum - Number(tx.amount);
    }, 0);
    return total + Number(account.openingBalance) + transactionSum;
  }, 0);
}

/**
 * Calculates total investment portfolio value.
 * For each asset order: SUM(deltaUnits * latestPrice).
 */
export function calculateInvestments(assetOrders: any[]): number {
  return assetOrders.reduce((total, order) => {
    const price = Number(order.asset.assetPrices[0]?.price ?? 0);
    const units = Number(order.deltaUnits);
    return total + price * units;
  }, 0);
}
