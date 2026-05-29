import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";

/**
 * Retrieves the authenticated user from the database.
 * Uses Clerk session to resolve userId.
 *
 * @returns authenticated user from the database.
 * @throws if the user is not authenticated or not found in the database.
 * @example
 * const user = await getAuthenticatedUser();
 */
export default async function getAuthenticatedUser() {
  const { userId } = await auth();

  if (userId == null) throw Error("[AUTH]: userId is null");

  try {
    return await prisma.user.findUnique({ where: { clerkUserId: userId } });
  } catch (e) {
    throw new Error("[AUTH]: Failed to fetch user: " + e);
  }
}
