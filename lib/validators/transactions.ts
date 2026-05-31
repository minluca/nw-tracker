import { z } from "zod";
import { TransactionType } from "@/lib/generated/prisma/client";

/** Validation schema for POST /api/transactions */
export const transactionPost = z.object({
  accountId: z.uuid(),
  categoryId: z.uuid().optional(),
  type: z.enum(TransactionType),
  payee: z.string(),
  memo: z.string().optional(),
  amount: z.number().positive(),
  date: z.coerce.date().optional(),
  currency: z.string().optional().default("EUR"),
});
