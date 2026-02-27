import { NextResponse } from "next/server";
import QRCode from "qrcode";
import prisma from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/card/[slug]
 * Generate an A5 printable card (SVG) with QR code for a cafe.
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const cafe = await prisma.cafe.findUnique({
      where: { slug: params.slug },
      select: { name: true, slug: true },
    });

    if (!cafe) {
      return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const tipUrl = `${appUrl}/cafe/${cafe.slug}`;

    const qrDataUrl = await QRCode.toDataURL(tipUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 820,
      color: {
        dark: "#1B273A",
        light: "#FFFFFF",
      },
    });

    // A5 portrait canvas (approx 150 DPI)
    const width = 1240;
    const height = 1748;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#F7F7F5"/>

  <rect x="70" y="70" width="${width - 140}" height="${height - 140}" rx="72" ry="72" fill="#FFFFFF" stroke="#1B273A" stroke-width="4"/>

  <text x="${width / 2}" y="410" text-anchor="middle" font-size="72" font-weight="800" fill="#0F172A" font-family="Vazirmatn, Arial, sans-serif">
    اگه تجربه خوبی داشتی، ایزی‌تیپ کن!
  </text>

  <text x="${width / 2}" y="500" text-anchor="middle" font-size="38" font-weight="700" fill="#64748B" font-family="Vazirmatn, Arial, sans-serif">
    ${escapeXml(cafe.name)}
  </text>

  <image href="${qrDataUrl}" x="${(width - 760) / 2}" y="560" width="760" height="760"/>

  <text x="${width / 2}" y="1390" text-anchor="middle" font-size="56" font-weight="800" fill="#0F172A" font-family="Vazirmatn, Arial, sans-serif">
    ایزی‌تیپ، اولین سرویس پرداخت انعام آنلاین
  </text>

  <text x="${width / 2}" y="1470" text-anchor="middle" font-size="34" font-weight="600" fill="#64748B" font-family="Vazirmatn, Arial, sans-serif">
    easytip.ir
  </text>
</svg>`;

    const isDownload = new URL(request.url).searchParams.get("download");

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=3600, stale-while-revalidate=86400",
        ...(isDownload
          ? {
              "Content-Disposition": `attachment; filename="a5-card-${cafe.slug}.svg"`,
            }
          : {}),
      },
    });
  } catch (error) {
    console.error("A5 card generation error:", error);
    return NextResponse.json({ error: "خطا در ساخت کارت A5" }, { status: 500 });
  }
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

