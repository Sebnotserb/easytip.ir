import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requestPayment } from "@/lib/payment";
import { calculateCommission, checkRateLimit, sanitizeText } from "@/lib/utils";

const MIN_TIP = 1_000; // Toman
const MAX_TIP = 5_000_000; // Toman

/**
 * POST /api/tips
 * Create a new tip and initiate payment with Zarinpal.
 * Called from the public tipping page (no auth required).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cafeId, amount, rating, comment, nickname } = body;

    // ── IP & User-Agent for logging and rate limiting ──
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    // ── Rate limiting: 5 tips per minute per IP ──
    if (!checkRateLimit(`tip:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "تعداد درخواست‌ها بیش از حد مجاز. لطفاً کمی صبر کنید." },
        { status: 429 }
      );
    }

    // ── Input validation ──
    if (!cafeId || !amount) {
      return NextResponse.json(
        { error: "مبلغ و شناسه کافه الزامی هستند" },
        { status: 400 }
      );
    }

    const tipAmount = parseInt(amount);
    if (isNaN(tipAmount) || tipAmount < MIN_TIP || tipAmount > MAX_TIP) {
      return NextResponse.json(
        { error: `مبلغ انعام باید بین ${MIN_TIP.toLocaleString()} تا ${MAX_TIP.toLocaleString()} تومان باشد` },
        { status: 400 }
      );
    }

    if (rating && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return NextResponse.json(
        { error: "امتیاز باید عدد صحیح بین ۱ تا ۵ باشد" },
        { status: 400 }
      );
    }

    // ── Check café exists and is active ──
    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
    });
    if (!cafe || !cafe.isActive) {
      return NextResponse.json(
        { error: "کافه یافت نشد یا غیرفعال است" },
        { status: 404 }
      );
    }

    // ── Anti-self-tipping: check if IP matches recent owner activity ──
    // (Basic MVP check — can be enhanced later)

    // ── Calculate fees ──
    const commission = calculateCommission(tipAmount);
    const totalPaid = tipAmount + commission;

    // ── Create tip record ──
    const tip = await prisma.tip.create({
      data: {
        amount: tipAmount,
        commission,
        totalPaid,
        rating: rating ? parseInt(rating) : null,
        comment: sanitizeText(comment, 500),
        nickname: sanitizeText(nickname, 50),
        cafeId,
        status: "PENDING",
        ipAddress: ip.substring(0, 45),
        userAgent: userAgent.substring(0, 255),
      },
    });

    // ── Request payment from Zarinpal ──
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/api/payments/verify?tipId=${tip.id}`;

    const payment = await requestPayment(
      totalPaid,
      `انعام به ${cafe.name}`,
      callbackUrl
    );

    if (!payment.success || !payment.authority) {
      // Mark tip as failed
      await prisma.tip.update({
        where: { id: tip.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: "خطا در اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید." },
        { status: 502 }
      );
    }

    // ── Create transaction record ──
    await prisma.transaction.create({
      data: {
        amount: totalPaid,
        type: "TIP_PAYMENT",
        status: "PENDING",
        authority: payment.authority,
        tipId: tip.id,
      },
    });

    return NextResponse.json({
      success: true,
      paymentUrl: payment.paymentUrl,
    });
  } catch (error) {
    console.error("Create tip error:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
