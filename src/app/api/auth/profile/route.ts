import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  getSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { isValidEmail, sanitizeText } from "@/lib/utils";

/**
 * PUT /api/auth/profile
 * Update current user's profile (name, email, phone, password).
 */
export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    // ── Name ──
    if (name !== undefined) {
      const clean = sanitizeText(name, 100);
      if (!clean) {
        return NextResponse.json(
          { error: "نام نمی‌تواند خالی باشد" },
          { status: 400 }
        );
      }
      updateData.name = clean;
    }

    // ── Email ──
    if (email !== undefined && email !== user.email) {
      const cleanEmail = email.toLowerCase().trim();
      if (!isValidEmail(cleanEmail)) {
        return NextResponse.json(
          { error: "فرمت ایمیل نامعتبر است" },
          { status: 400 }
        );
      }
      const existing = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { error: "این ایمیل قبلاً ثبت شده است" },
          { status: 409 }
        );
      }
      updateData.email = cleanEmail;
    }

    // ── Phone ──
    if (phone !== undefined) {
      const cleanPhone = phone ? phone.trim().replace(/\s/g, "") : null;
      if (cleanPhone && !/^09\d{9}$/.test(cleanPhone)) {
        return NextResponse.json(
          { error: "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود" },
          { status: 400 }
        );
      }
      if (cleanPhone) {
        const existingPhone = await prisma.user.findUnique({
          where: { phone: cleanPhone },
        });
        if (existingPhone && existingPhone.id !== user.id) {
          return NextResponse.json(
            { error: "این شماره موبایل قبلاً ثبت شده است" },
            { status: 409 }
          );
        }
      }
      updateData.phone = cleanPhone;
    }

    // ── Password change ──
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "رمز عبور فعلی الزامی است" },
          { status: 400 }
        );
      }
      const valid = await verifyPassword(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json(
          { error: "رمز عبور فعلی اشتباه است" },
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد" },
          { status: 400 }
        );
      }
      updateData.password = await hashPassword(newPassword);
    }

    // ── Update ──
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true, message: "تغییری وجود ندارد" });
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}
