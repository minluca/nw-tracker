import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";

/**
 * Retrieves the authenticated user from the database.
 * Uses Clerk session to resolve userId.
 *
 * @returns authenticated user from the database, or null if not authenticated.
 * @throws if the database query fails.
 * @example
 * const user = await getAuthenticatedUser();
 */
export default async function getAuthenticatedUser() {
  const { userId } = await auth();

  if (userId == null) {
    console.warn("[AUTH] Unathenticated request - userId is null");
    return null;
  }
  try {
    return await prisma.user.findUnique({ where: { clerkUserId: userId } });
  } catch (e) {
    console.error("[AUTH]: Failed fo fetch user: ", e);
    throw new Error("[AUTH]: Failed to fetch user: " + e);
  }
}
