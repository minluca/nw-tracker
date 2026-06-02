import { withAuth } from "@/lib/api";
import { createCategory, getUserCategories } from "@/lib/db/categories";
import { categoryPost } from "@/lib/validators/categories";
import { NextRequest, NextResponse } from "next/server";

/**
 * Returns all categories for the authenticated user.
 *
 * @returns 200 with category list, 401 if unauthorized, 500 on database error.
 */
export async function GET(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const categories = await getUserCategories(user.id);
      return NextResponse.json(categories);
    } catch (e) {
      console.error("[CATEGORIES] Failed to fetch user categories:", e);
      return NextResponse.json(
        { error: "[CATEGORIES] Failed to fetch user categories" },
        { status: 500 },
      );
    }
  });
}

/**
 * Creates a new category for the authenticated user.
 * Validates input with Zod before inserting.
 *
 * @returns 201 with created category, 400 if invalid input, 401 if unauthorized, 500 on database error.
 */
export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json();
      const validatedBody = categoryPost.safeParse(body);
      if (!validatedBody.success) {
        console.error("[CATEGORIES] Invalid POST input:", validatedBody.error);
        return NextResponse.json(
          { error: "[CATEGORIES] Invalid POST input" },
          { status: 400 },
        );
      }
      const category = await createCategory(user.id, {
        ...validatedBody.data,
      });
      console.log("[CATEGORIES] Category created:", category.id);
      return NextResponse.json(category, { status: 201 });
    } catch (e) {
      console.error("[CATEGORIES] Failed to insert category:", e);
      return NextResponse.json(
        { error: "[CATEGORIES] Failed to insert category" },
        { status: 500 },
      );
    }
  });
}
