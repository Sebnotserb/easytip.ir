import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  hashPassword,
  createToken,
  setTokenCookie,
} from "@/lib/auth";
import { generateSlug, isValidEmail, sanitizeText } from "@/lib/utils";

/**
 * POST /api/auth/register
 * Register a new café owner + create their café profile.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, cafeName, phone } = body;

    // ── Validation ──
    if (!name || !email || !password || !cafeName) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "فرمت ایمیل نامعتبر است" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
        { status: 400 }
      );
    }

    if (cafeName.trim().length < 2) {
      return NextResponse.json(
        { error: "نام کافه باید حداقل ۲ کاراکتر باشد" },
        { status: 400 }
      );
    }

    // ── Validate phone format (optional, Iranian mobile: 09xxxxxxxxx) ──
    const cleanPhone = phone ? phone.trim().replace(/\s/g, "") : null;
    if (cleanPhone && !/^09\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود" },
        { status: 400 }
      );
    }

    // ── Check existing email ──
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    // ── Check existing phone (if provided) ──
    if (cleanPhone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: cleanPhone },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: "این شماره موبایل قبلاً ثبت شده است" },
          { status: 409 }
        );
      }
    }

    // ── Generate unique slug ──
    let slug = generateSlug(cafeName);
    if (!slug) slug = `cafe-${Date.now().toString(36)}`;
    const existingSlug = await prisma.cafe.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // ── Create user + café in a transaction ──
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name: sanitizeText(name, 100) || name.trim(),
        email: email.toLowerCase().trim(),
        ...(cleanPhone && { phone: cleanPhone }),
        password: hashedPassword,
        role: "CAFE_OWNER",
        cafe: {
          create: {
            name: cafeName.trim(),
            slug,
          },
        },
      },
      include: { cafe: true },
    });

    // ── Create JWT and set cookie ──
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      cafe: { slug: user.cafe?.slug },
    });

    setTokenCookie(response, token);

    // ── Audit log ──
    await prisma.auditLog.create({
      data: {
        action: "USER_REGISTER",
        entity: "user",
        entityId: user.id,
        data: { email: user.email, cafeName: cafeName.trim() },
      },
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "خطای سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
