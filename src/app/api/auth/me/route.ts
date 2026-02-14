import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * GET /api/auth/me
 * Get current authenticated user with café info.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { cafe: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      cafe: user.cafe
        ? {
            id: user.cafe.id,
            name: user.cafe.name,
            slug: user.cafe.slug,
            description: user.cafe.description,
            logo: user.cafe.logo,
            instagram: user.cafe.instagram,
            thankYouMessage: user.cafe.thankYouMessage,
            walletBalance: user.cafe.walletBalance,
            isActive: user.cafe.isActive,
          }
        : null,
    },
  });
}
