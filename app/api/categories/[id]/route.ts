import { withAuth } from "@/lib/api";
import { deleteCategory } from "@/lib/db/categories";
import { NextRequest, NextResponse } from "next/server";

/**
 * Deletes a category by ID for the authenticated user.
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

      await deleteCategory(id);

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
      console.error("[CATEGORY] Failed to delete category: ", e);
      return NextResponse.json(
        { error: "[CATEGORY] Failed to delete category" },
        { status: 500 },
      );
    }
  });
}
