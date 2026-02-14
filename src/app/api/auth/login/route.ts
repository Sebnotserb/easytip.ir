import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  verifyPassword,
  createToken,
  setTokenCookie,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/utils";

/**
 * POST /api/auth/login
 * Authenticate café owner or admin.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ایمیل و رمز عبور الزامی هستند" },
        { status: 400 }
      );
    }

    // Rate limit: 10 attempts per minute per email
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!checkRateLimit(`login:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "تعداد تلاش‌ها بیش از حد مجاز. لطفاً کمی صبر کنید." },
        { status: 429 }
      );
    }

    // ── Find user ──
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { cafe: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // ── Verify password ──
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // ── Create token ──
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      cafe: user.cafe
        ? { slug: user.cafe.slug, name: user.cafe.name }
        : null,
    });

    setTokenCookie(response, token);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "خطای سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
