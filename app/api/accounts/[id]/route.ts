import { withAuth } from "@/lib/api";
import { deleteAccount } from "@/lib/db/accounts";
import { NextRequest, NextResponse } from "next/server";

/**
 * Deletes an account by ID for the authenticated user.
 *
 * @returns 200 on success, 401 if unauthorized, 500 on database error.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(async (user) => {
    try {
      const { id } = await params;

      await deleteAccount(id);

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
      console.error("[ACCOUNTS] Failed to delete account: ", e);
      return NextResponse.json(
        { error: "[ACCOUNTS] Failed to delete account" },
        { status: 500 },
      );
    }
  });
}
