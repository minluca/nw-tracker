import { User } from "@/lib/generated/prisma/client";
import { NextResponse } from "next/server";
import getAuthenticatedUser from "./auth";

/**
 * Wraps an API route handler with authentication.
 * Returns 401 if the user is not authenticated.
 *
 * @param handler - the route handler to execute if authenticated
 * @returns the handler response, or 401 if unauthorized
 * @example
 * export async function GET() {
 *   return withAuth(async (user) => {
 *     return NextResponse.json({ id: user.id });
 *   });
 * }
 */
export async function withAuth(handler: (user: User) => Promise<NextResponse>) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handler(user);
}
