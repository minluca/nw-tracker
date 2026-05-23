import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const expense = await prisma.expense.delete({
      where: { id },
    });
    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.error("Error deleting expense with id:", error);
    return NextResponse.json({ error: "Failed to delete expense with id:" }, { status: 500 });
  }
}