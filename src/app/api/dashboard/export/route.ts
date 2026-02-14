import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateCSV } from "@/lib/utils";

/**
 * GET /api/dashboard/export
 * Export café tips as a CSV file.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cafe = await prisma.cafe.findFirst({
    where: { ownerId: session.userId },
  });
  if (!cafe) {
    return NextResponse.json({ error: "Café not found" }, { status: 404 });
  }

  const tips = await prisma.tip.findMany({
    where: { cafeId: cafe.id, status: "PAID" },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "تاریخ",
    "مبلغ انعام (تومان)",
    "کمیسیون (تومان)",
    "کل پرداخت (تومان)",
    "امتیاز",
    "نام",
    "نظر",
    "شناسه پرداخت",
  ];

  const rows = tips.map((tip) => [
    new Date(tip.createdAt).toLocaleDateString("fa-IR"),
    tip.amount.toString(),
    tip.commission.toString(),
    tip.totalPaid.toString(),
    tip.rating?.toString() || "",
    tip.nickname || "",
    tip.comment || "",
    tip.paymentRef || "",
  ]);

  const csv = generateCSV(headers, rows);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tips-${cafe.slug}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
