import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeText } from "@/lib/utils";

/**
 * GET /api/tickets
 * List tickets — café owners see their own, admins see all.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.role === "ADMIN";

  const tickets = await prisma.ticket.findMany({
    where: isAdmin ? {} : { userId: session.userId },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ tickets });
}

/**
 * POST /api/tickets
 * Create a new support ticket.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { subject, message } = body;

    const cleanSubject = sanitizeText(subject, 200);
    const cleanMessage = sanitizeText(message, 2000);

    if (!cleanSubject || !cleanMessage) {
      return NextResponse.json(
        { error: "عنوان و متن پیام الزامی هستند" },
        { status: 400 }
      );
    }

    // Get user's cafe ID if exists
    const cafe = await prisma.cafe.findFirst({
      where: { ownerId: session.userId },
      select: { id: true },
    });

    const ticket = await prisma.ticket.create({
      data: {
        subject: cleanSubject,
        message: cleanMessage,
        userId: session.userId,
        cafeId: cafe?.id || null,
      },
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}
