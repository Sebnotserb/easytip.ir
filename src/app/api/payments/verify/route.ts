import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPayment } from "@/lib/payment";

/**
 * GET /api/payments/verify
 * Callback URL from Zarinpal after payment.
 * Verifies the transaction and updates all related records.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const authority = url.searchParams.get("Authority");
  const status = url.searchParams.get("Status");
  const tipId = url.searchParams.get("tipId");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // ── Missing parameters ──
  if (!authority || !tipId) {
    return NextResponse.redirect(`${appUrl}/thank-you?status=failed`);
  }

  try {
    // ── Find the transaction ──
    const transaction = await prisma.transaction.findFirst({
      where: { authority, tipId },
      include: { tip: true },
    });

    if (!transaction || !transaction.tip) {
      return NextResponse.redirect(`${appUrl}/thank-you?status=failed`);
    }

    // ── Already processed ──
    if (transaction.status === "COMPLETED") {
      return NextResponse.redirect(
        `${appUrl}/thank-you?status=success&amount=${transaction.tip.totalPaid}`
      );
    }

    // ── Payment cancelled or failed at gateway ──
    if (status !== "OK") {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: "FAILED" },
        }),
        prisma.tip.update({
          where: { id: tipId },
          data: { status: "FAILED" },
        }),
      ]);
      return NextResponse.redirect(`${appUrl}/thank-you?status=failed`);
    }

    // ── Verify with Zarinpal ──
    const verification = await verifyPayment(authority, transaction.amount);

    if (!verification.success) {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: "FAILED" },
        }),
        prisma.tip.update({
          where: { id: tipId },
          data: { status: "FAILED" },
        }),
      ]);
      return NextResponse.redirect(`${appUrl}/thank-you?status=failed`);
    }

    // ── Payment verified — update all records ──
    const refId = verification.refId?.toString() || "";

    await prisma.$transaction([
      // Mark transaction as completed
      prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "COMPLETED",
          reference: refId,
        },
      }),
      // Mark tip as paid
      prisma.tip.update({
        where: { id: tipId },
        data: {
          status: "PAID",
          paymentRef: refId,
        },
      }),
      // Add tip amount to café wallet (commission stays with platform)
      prisma.cafe.update({
        where: { id: transaction.tip.cafeId },
        data: {
          walletBalance: { increment: transaction.tip.amount },
          totalTips: { increment: transaction.tip.amount },
        },
      }),
    ]);

    // ── Audit log ──
    await prisma.auditLog.create({
      data: {
        action: "TIP_PAID",
        entity: "tip",
        entityId: tipId,
        data: {
          amount: transaction.tip.amount,
          commission: transaction.tip.commission,
          totalPaid: transaction.tip.totalPaid,
          cafeId: transaction.tip.cafeId,
          refId,
        },
        ipAddress: transaction.tip.ipAddress,
      },
    });

    return NextResponse.redirect(
      `${appUrl}/thank-you?status=success&amount=${transaction.tip.totalPaid}`
    );
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.redirect(`${appUrl}/thank-you?status=failed`);
  }
}
