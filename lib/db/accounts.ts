import { AccountType, TransactionType } from "../generated/prisma/enums";
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
    console.error("[DB] Failed to fetch accounts with transactions: ", e);
    throw new Error("[DB] Failed to fetch accounts with transactions: " + e);
  }
}

/**
 * Fetches all accounts for a given user.
 *
 * @param userId - the internal database user ID
 * @returns list of accounts with all fields
 * @throws if the database query fails
 */
export async function getUserAccounts(userId: string) {
  try {
    return await prisma.account.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        openingBalance: true,
        openingDate: true,
        currency: true,
        isActive: true,
        linkedForInvestments: true,
      },
    });
  } catch (e) {
    console.error("[DB] Failed to fetch user accounts: ", e);
    throw new Error("[DB] Failed to fetch user accounts: " + e);
  }
}

/**
 * Creates a new account for a given user.
 *
 * @param userId - the internal database user ID
 * @param input - account data (name, type, openingBalance, and optional fields)
 * @returns the created account record
 * @throws if the database insert fails
 */
export async function createAccount(
  userId: string,
  input: {
    name: string;
    type: AccountType;
    openingBalance: number;
    openingDate: Date;
    currency?: string;
    isActive: boolean;
    linkedForInvestments: boolean;
  },
) {
  try {
    return await prisma.account.create({
      data: {
        userId: userId,
        name: input.name,
        type: input.type,
        openingBalance: input.openingBalance,
        openingDate: input.openingDate,
        currency: input.currency,
        isActive: input.isActive,
        linkedForInvestments: input.linkedForInvestments,
      },
    });
  } catch (e) {
    console.error("[DB] Failed to create account: ", e);
    throw new Error("[DB] Failed to create account: " + e);
  }
}

/**
 * Deletes an account by ID.
 *
 * @param id - the account ID to delete
 * @returns the deleted account record
 * @throws if the database delete fails
 */
export async function deleteAccount(id: string) {
  try {
    return await prisma.account.delete({
      where: {
        id: id,
      },
    });
  } catch (e) {
    console.error("[DB] Failed to delete account: ", e);
    throw new Error("[DB] Failed to delete account: " + e);
  }
}
