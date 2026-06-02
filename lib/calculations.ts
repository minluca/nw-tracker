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

/**
 * Calculates total income and expenses from a list of accounts with transactions.
 * Used to compute the cashflow summary for the current month.
 *
 * @param accountsWithTransactions - list of accounts with transactions (amount and type)
 * @returns object with total income and total expenses
 */
export function calculateCashflow(accountsWithTransactions: any[]): {
  income: number;
  expenses: number;
} {
  let income = 0;
  let expenses = 0;

  accountsWithTransactions.forEach((account) => {
    account.transactions.forEach((tx) => {
      if (tx.type === "income") income += Number(tx.amount);
      else expenses += Number(tx.amount);
    });
  });

  return { income, expenses };
}
