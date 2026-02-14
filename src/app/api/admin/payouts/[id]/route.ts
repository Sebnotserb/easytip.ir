import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * PUT /api/admin/payouts/[id]
 * Admin: update payout status (process, complete, or reject).
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["PROCESSING", "COMPLETED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "وضعیت نامعتبر است" },
        { status: 400 }
      );
    }

    const payout = await prisma.payout.findUnique({
      where: { id: params.id },
    });

    if (!payout) {
      return NextResponse.json(
        { error: "درخواست برداشت یافت نشد" },
        { status: 404 }
      );
    }

    // If rejecting, refund the café wallet
    if (status === "REJECTED" && payout.status !== "REJECTED") {
      await prisma.$transaction([
        prisma.payout.update({
          where: { id: params.id },
          data: { status },
        }),
        prisma.cafe.update({
          where: { id: payout.cafeId },
          data: { walletBalance: { increment: payout.amount } },
        }),
      ]);
    } else {
      await prisma.payout.update({
        where: { id: params.id },
        data: { status },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "PAYOUT_STATUS_UPDATE",
        entity: "payout",
        entityId: params.id,
        userId: session.userId,
        data: {
          newStatus: status,
          previousStatus: payout.status,
          amount: payout.amount,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update payout error:", error);
    return NextResponse.json(
      { error: "خطا در بروزرسانی وضعیت" },
      { status: 500 }
    );
  }
}
