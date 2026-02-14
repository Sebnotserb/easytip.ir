import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { randomBytes } from "crypto";

/**
 * POST /api/auth/forgot-password
 * Generate a password reset token and log the reset link.
 * In production, replace console.log with an actual email service.
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "ایمیل الزامی است" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "اگر ایمیل شما در سیستم ثبت باشد، لینک بازیابی ارسال خواهد شد.",
      });
    }

    // Generate a secure random token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate previous tokens for this email
    await prisma.passwordReset.updateMany({
      where: { email: user.email, used: false },
      data: { used: true },
    });

    // Create new token
    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token,
        expiresAt,
      },
    });

    // Build reset link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/auth/reset-password?token=${token}`;

    // TODO: Replace with actual email sending (Nodemailer, Kavenegar, etc.)
    console.log("═══════════════════════════════════════════");
    console.log("🔑 PASSWORD RESET LINK:");
    console.log(resetLink);
    console.log("   For:", user.email);
    console.log("   Expires:", expiresAt.toISOString());
    console.log("═══════════════════════════════════════════");

    return NextResponse.json({
      success: true,
      message: "اگر ایمیل شما در سیستم ثبت باشد، لینک بازیابی ارسال خواهد شد.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}
