import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeText } from "@/lib/utils";

/**
 * POST /api/tickets/[id]/reply
 * Add a reply to a ticket. Both users and admins can reply.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
    });

    if (!ticket) {
      return NextResponse.json({ error: "تیکت یافت نشد" }, { status: 404 });
    }

    // Non-admin users can only reply to their own tickets
    if (session.role !== "ADMIN" && ticket.userId !== session.userId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { message } = await request.json();
    const cleanMessage = sanitizeText(message, 2000);

    if (!cleanMessage) {
      return NextResponse.json(
        { error: "متن پیام الزامی است" },
        { status: 400 }
      );
    }

    const isAdmin = session.role === "ADMIN";

    // Create reply and update ticket status
    const reply = await prisma.ticketReply.create({
      data: {
        message: cleanMessage,
        isAdmin,
        ticketId: params.id,
        userId: session.userId,
      },
    });

    // If admin replies, set status to IN_PROGRESS (if it was OPEN)
    if (isAdmin && ticket.status === "OPEN") {
      await prisma.ticket.update({
        where: { id: params.id },
        data: { status: "IN_PROGRESS" },
      });
    }

    // If user replies to a CLOSED ticket, reopen it
    if (!isAdmin && ticket.status === "CLOSED") {
      await prisma.ticket.update({
        where: { id: params.id },
        data: { status: "OPEN" },
      });
    }

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Ticket reply error:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}
