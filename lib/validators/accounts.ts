import { z } from "zod";
import { AccountType } from "@/lib/generated/prisma/client";

/** Validation schema for POST /api/accounts */
export const accountPost = z.object({
  name: z.string(),
  type: z.enum(AccountType),
  openingBalance: z.number().nonnegative(),
  openingDate: z.coerce.date().optional(),
  currency: z.string().optional().default("EUR"),
  isActive: z.boolean(),
  linkedForInvestments: z.boolean(),
});
