import getAuthenticatedUser from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { error: "[TRANSACTIONS] Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const lastFiveTransactions = await prisma.transaction.findMany({
      where: {
        account: {
          userId: user.id,
        },
      },
      orderBy: { date: "desc" },
      take: 5,
      select: {
        id: true,
        date: true,
        payee: true,
        amount: true,
        currency: true,
        type: true,
        category: {
          select: {
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json(lastFiveTransactions);
  } catch (e) {
    return NextResponse.json(
      { error: "[TRANSACTIONS] Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
