import { withAuth } from "@/lib/api";
import { createAccount, getUserAccounts } from "@/lib/db/accounts";
import { accountPost } from "@/lib/validators/accounts";
import { NextRequest, NextResponse } from "next/server";

/**
 * Returns all accounts for the authenticated user.
 *
 * @returns 200 with account list, 401 if unauthorized, 500 on database error.
 */
export async function GET(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const accounts = await getUserAccounts(user.id);
      return NextResponse.json(accounts);
    } catch (e) {
      console.error("[ACCOUNTS] Failed to fetch user accounts: ", e);
      return NextResponse.json(
        { error: "[ACCOUNTS] Failed to fetch user accounts" },
        { status: 500 },
      );
    }
  });
}

/**
 * Creates a new account for the authenticated user.
 * Validates input with Zod before inserting.
 *
 * @returns 201 with created account, 400 if invalid input, 401 if unauthorized, 500 on database error.
 */
export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const validatedBody = accountPost.safeParse(body);

      if (!validatedBody.success) {
        console.error("[ACCOUNTS] Invalid POST input:", validatedBody.error);
        return NextResponse.json(
          { error: "[ACCOUNTS] Invalid POST input" },
          { status: 400 },
        );
      }

      const account = await createAccount(user.id, {
        ...validatedBody.data, // object spread syntax
        openingDate: validatedBody.data.openingDate ?? new Date(),
      });
      console.log("[ACCOUNTS] Account created:", account.id);

      return NextResponse.json(account, { status: 201 });
    } catch (e) {
      console.error("[ACCOUNTS] Failed to insert account:", e);
      return NextResponse.json(
        { error: "[ACCOUNTS] Failed to insert account" },
        { status: 500 },
      );
    }
  });
}
