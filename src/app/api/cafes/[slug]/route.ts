import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET /api/cafes/[slug]
 * Public: get café info for the tipping page.
 */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const cafe = await prisma.cafe.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      thankYouMessage: true,
      isActive: true,
    },
  });

  if (!cafe || !cafe.isActive) {
    return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
  }

  return NextResponse.json(cafe);
}

/**
 * PUT /api/cafes/[slug]
 * Owner-only: update café settings.
 */
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cafe = await prisma.cafe.findUnique({
    where: { slug: params.slug },
  });

  if (!cafe) {
    return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
  }

  // Only the owner can update
  if (cafe.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, thankYouMessage, logo, instagram, telegramChatId } = body;

  const updated = await prisma.cafe.update({
    where: { id: cafe.id },
    data: {
      ...(name && { name: name.trim().substring(0, 100) }),
      ...(description !== undefined && {
        description: description?.trim().substring(0, 500) || null,
      }),
      ...(thankYouMessage !== undefined && {
        thankYouMessage: thankYouMessage?.trim().substring(0, 200) || null,
      }),
      ...(logo !== undefined && { logo: logo || null }),
      ...(instagram !== undefined && {
        instagram: instagram?.trim().replace(/^@/, "").substring(0, 100) || null,
      }),
      ...(telegramChatId !== undefined && {
        telegramChatId: telegramChatId?.trim() || null,
      }),
    },
  });

  return NextResponse.json({
    success: true,
    cafe: {
      name: updated.name,
      description: updated.description,
      thankYouMessage: updated.thankYouMessage,
      logo: updated.logo,
      instagram: updated.instagram,
      telegramChatId: updated.telegramChatId,
    },
  });
}
