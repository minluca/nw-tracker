import z from "zod";
import { CategoryType } from "../generated/prisma/enums";

/** Validation schema for POST /api/categories */
export const categoryPost = z.object({
  name: z.string(),
  type: z.enum(CategoryType),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});
