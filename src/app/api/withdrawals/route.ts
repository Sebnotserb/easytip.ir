import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculateWithdrawalFee } from "@/lib/utils";

/**
 * GET /api/withdrawals
 * Get wallet balance and payout history for the current café.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cafe = await prisma.cafe.findFirst({
    where: { ownerId: session.userId },
  });
  if (!cafe) {
    return NextResponse.json({ error: "Café not found" }, { status: 404 });
  }

  const payouts = await prisma.payout.findMany({
    where: { cafeId: cafe.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    walletBalance: cafe.walletBalance,
    payouts,
  });
}

/**
 * POST /api/withdrawals
 * Request a new withdrawal from café wallet.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cafe = await prisma.cafe.findFirst({
    where: { ownerId: session.userId },
  });
  if (!cafe) {
    return NextResponse.json({ error: "Café not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { amount, bankInfo } = body;

    // ── Validation ──
    const withdrawAmount = parseInt(amount);
    if (!withdrawAmount || withdrawAmount < 10_000) {
      return NextResponse.json(
        { error: "حداقل مبلغ برداشت ۱۰,۰۰۰ تومان است" },
        { status: 400 }
      );
    }

    if (withdrawAmount > cafe.walletBalance) {
      return NextResponse.json(
        { error: "موجودی کیف‌پول کافی نیست" },
        { status: 400 }
      );
    }

    if (!bankInfo || bankInfo.trim().length < 10) {
      return NextResponse.json(
        { error: "اطلاعات بانکی معتبر وارد کنید" },
        { status: 400 }
      );
    }

    // Check for pending withdrawals
    const pendingCount = await prisma.payout.count({
      where: { cafeId: cafe.id, status: "PENDING" },
    });
    if (pendingCount >= 3) {
      return NextResponse.json(
        { error: "شما ۳ درخواست برداشت در انتظار دارید. لطفاً صبر کنید." },
        { status: 400 }
      );
    }

    // ── Calculate fee ──
    const fee = calculateWithdrawalFee(withdrawAmount);
    const netAmount = withdrawAmount - fee;

    // ── Create payout and deduct from wallet atomically ──
    const payout = await prisma.$transaction(async (tx) => {
      // Re-check balance inside transaction for safety
      const freshCafe = await tx.cafe.findUnique({
        where: { id: cafe.id },
      });
      if (!freshCafe || freshCafe.walletBalance < withdrawAmount) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      await tx.cafe.update({
        where: { id: cafe.id },
        data: { walletBalance: { decrement: withdrawAmount } },
      });

      return tx.payout.create({
        data: {
          amount: withdrawAmount,
          fee,
          netAmount,
          cafeId: cafe.id,
          bankInfo: bankInfo.trim(),
          status: "PENDING",
        },
      });
    });

    // ── Audit log ──
    await prisma.auditLog.create({
      data: {
        action: "WITHDRAWAL_REQUEST",
        entity: "payout",
        entityId: payout.id,
        userId: session.userId,
        data: {
          amount: withdrawAmount,
          fee,
          netAmount,
          bankInfo: bankInfo.trim(),
        },
      },
    });

    return NextResponse.json({ success: true, payout });
  } catch (error: any) {
    if (error?.message === "INSUFFICIENT_BALANCE") {
      return NextResponse.json(
        { error: "موجودی کیف‌پول کافی نیست" },
        { status: 400 }
      );
    }
    console.error("Withdrawal error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت درخواست برداشت" },
      { status: 500 }
    );
  }
}
