import { AccountType, CategoryType } from "../generated/prisma/enums";
import prisma from "../prisma";

/**
 * Fetches all categories for a given user.
 *
 * @param userId - the internal database user ID
 * @returns list of categories with all fields
 * @throws if the database query fails
 */
export async function getUserCategories(userId: string) {
  try {
    return await prisma.category.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        icon: true,
        color: true,
        isActive: true,
        sortOrder: true,
      },
    });
  } catch (e) {
    console.error("[DB] Failed to fetch user categories: ", e);
    throw new Error("[DB] Failed to fetch user categories: " + e);
  }
}

/**
 * Creates a new category for a given user.
 *
 * @param userId - the internal database user ID
 * @param input - category data (name, type, and optional fields)
 * @returns the created category record
 * @throws if the database insert fails
 */
export async function createCategory(
  userId: string,
  input: {
    name: string;
    type: CategoryType;
    icon?: string;
    color?: string;
    isActive?: boolean;
    sortOrder?: number;
  },
) {
  try {
    return await prisma.category.create({
      data: {
        userId: userId,
        name: input.name,
        type: input.type,
        icon: input.icon,
        color: input.color,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  } catch (e) {
    console.error("[DB] Failed to create category: ", e);
    throw new Error("[DB] Failed to create category: " + e);
  }
}

/**
 * Deletes a category by ID.
 *
 * @param id - the category ID to delete
 * @returns the deleted category record
 * @throws if the database delete fails
 */
export async function deleteCategory(id: string) {
  try {
    return await prisma.category.delete({
      where: {
        id: id,
      },
    });
  } catch (e) {
    console.error("[DB] Failed to delete category: ", e);
    throw new Error("[DB] Failed to delete category: " + e);
  }
}
