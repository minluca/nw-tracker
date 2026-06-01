import prisma from "../prisma";

/**
 * Creates a new user in the database.
 *
 * @param clerkUserId - the Clerk user ID from the webhook payload
 * @param email - the primary email address of the user
 * @throws if the database insert fails
 * @example
 * await createUser("user_abc123", "mario@example.com");
 */
export async function createUser(clerkUserId: string, email: string) {
  try {
    await prisma.user.create({
      data: {
        clerkUserId: clerkUserId,
        email: email,
      },
    });
  } catch (e) {
    console.error("[DB] Failed to create user: ", e);
    throw new Error("[DB] Failed to create user: " + e);
  }
}
