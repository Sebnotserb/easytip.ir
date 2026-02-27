import { NextResponse } from "next/server";
import QRCode from "qrcode";
import prisma from "@/lib/db";
import { readFile } from "fs/promises";
import path from "path";

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
      select: { name: true, slug: true, logo: true },
    });

    if (!cafe) {
      return NextResponse.json({ error: "کافه یافت نشد" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const tipUrl = `${appUrl}/cafe/${cafe.slug}`;

    // Brand DNA: #6bcf9c (primary), #ffffff (white), #111827 (dark)
    const primary = "#6bcf9c";
    const dark = "#111827";
    const white = "#ffffff";

    const qrDataUrl = await QRCode.toDataURL(tipUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 760,
      color: { dark, light: white },
    });

    const width = 1240;
    const height = 1748;

    const zarinpalLogo = await loadPublicPngDataUrl("logos/zarinpal.png");
    const enamadLogo =
      (await loadPublicPngDataUrl("logos/enamad.png")) ||
      (await fetchPngAsDataUrl(
        "https://trustseal.enamad.ir/logo.aspx?id=707249&Code=cAnUJyqX8J5vxj2Oc25ZyASEopJc8q4Z"
      ));
    const cafeLogo = cafe.logo ? cafe.logo.trim() : "";
    const hasCafeLogo = Boolean(cafeLogo);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#FAFBFC"/>
  <rect x="48" y="48" width="${width - 96}" height="${height - 96}" rx="32" ry="32" fill="${white}" stroke="${dark}" stroke-width="3"/>

  <!-- Header: brand accent strip + cafe identity -->
  <rect x="48" y="48" width="${width - 96}" height="220" rx="32" ry="32" fill="${dark}"/>
  <rect x="48" y="220" width="${width - 96}" height="48" fill="${dark}"/>

  ${
    hasCafeLogo
      ? `<image href="${escapeXml(cafeLogo)}" x="${width / 2 - 48}" y="100" width="96" height="96" preserveAspectRatio="xMidYMid slice" clip-path="url(#logoClip)"/>`
      : `<circle cx="${width / 2}" cy="148" r="48" fill="${primary}"/><text x="${width / 2}" y="168" text-anchor="middle" font-size="48" font-weight="700" fill="${white}" font-family="Vazirmatn, Arial, sans-serif">☕</text>`
  }
  <text x="${width / 2}" y="258" text-anchor="middle" font-size="42" font-weight="800" fill="${white}" font-family="Vazirmatn, Arial, sans-serif">
    ${escapeXml(cafe.name)}
  </text>

  <!-- CTA: brand primary accent -->
  <text x="${width / 2}" y="380" text-anchor="middle" font-size="58" font-weight="800" fill="${dark}" font-family="Vazirmatn, Arial, sans-serif">
    اگه تجربه خوبی داشتی،
  </text>
  <text x="${width / 2}" y="450" text-anchor="middle" font-size="58" font-weight="800" fill="${primary}" font-family="Vazirmatn, Arial, sans-serif">
    ایزی‌تیپ کن!
  </text>

  <!-- QR: clean panel with brand border -->
  <rect x="${width / 2 - 400}" y="500" width="800" height="800" rx="24" ry="24" fill="#F8FAFC" stroke="${primary}" stroke-width="4"/>
  <image href="${qrDataUrl}" x="${width / 2 - 350}" y="550" width="700" height="700"/>

  <!-- Tagline (brand DNA) -->
  <text x="${width / 2}" y="1380" text-anchor="middle" font-size="36" font-weight="700" fill="${dark}" font-family="Vazirmatn, Arial, sans-serif">
    دریافت انعام با راه‌حل مدرن QR
  </text>

  <!-- Trust badges -->
  <g transform="translate(${width / 2 - 260},1420)">
    <rect x="0" y="0" width="520" height="100" rx="20" ry="20" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="2"/>
    ${
      zarinpalLogo
        ? `<image href="${zarinpalLogo}" x="36" y="18" width="120" height="64" preserveAspectRatio="xMidYMid meet"/>`
        : `<text x="96" y="62" text-anchor="middle" font-size="22" font-weight="700" fill="${dark}" font-family="Vazirmatn, Arial, sans-serif">Zarinpal</text>`
    }
    <line x1="260" y1="16" x2="260" y2="84" stroke="#E2E8F0" stroke-width="2"/>
    ${
      enamadLogo
        ? `<image href="${enamadLogo}" x="296" y="12" width="160" height="76" preserveAspectRatio="xMidYMid meet"/>`
        : `<text x="376" y="62" text-anchor="middle" font-size="20" font-weight="700" fill="${dark}" font-family="Vazirmatn, Arial, sans-serif">eNAMAD</text>`
    }
  </g>

  <!-- Footer: domain + brand values hint -->
  <text x="${width / 2}" y="1580" text-anchor="middle" font-size="28" font-weight="700" fill="${dark}" font-family="Vazirmatn, Arial, sans-serif">
    easytip.ir
  </text>
  <text x="${width / 2}" y="1630" text-anchor="middle" font-size="20" font-weight="500" fill="#64748B" font-family="Vazirmatn, Arial, sans-serif">
    شفاف · مدرن · کارآمد
  </text>

  <defs>
    <clipPath id="logoClip">
      <circle cx="${width / 2}" cy="148" r="48"/>
    </clipPath>
  </defs>
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

async function loadPublicPngDataUrl(relativePath: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "public", relativePath);
    const data = await readFile(filePath);
    return `data:image/png;base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

async function fetchPngAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arr = await res.arrayBuffer();
    return `data:image/png;base64,${Buffer.from(arr).toString("base64")}`;
  } catch {
    return null;
  }
}

