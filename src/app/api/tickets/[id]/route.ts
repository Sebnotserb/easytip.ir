import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET /api/tickets/[id]
 * Get ticket detail with all replies.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      replies: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "تیکت یافت نشد" }, { status: 404 });
  }

  // Non-admin users can only see their own tickets
  if (session.role !== "ADMIN" && ticket.userId !== session.userId) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  return NextResponse.json({ ticket });
}

/**
 * PUT /api/tickets/[id]
 * Update ticket status (admin only).
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { status } = await request.json();

    if (!["OPEN", "IN_PROGRESS", "CLOSED"].includes(status)) {
      return NextResponse.json(
        { error: "وضعیت نامعتبر" },
        { status: 400 }
      );
    }

    await prisma.ticket.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}
