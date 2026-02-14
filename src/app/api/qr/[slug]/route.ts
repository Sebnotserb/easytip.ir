import { NextResponse } from "next/server";
import QRCode from "qrcode";

// Ensure this route runs in Node.js runtime (needed for QR generation)
export const runtime = "nodejs";

/**
 * GET /api/qr/[slug]
 * Generate a QR code PNG image for a café's tipping page.
 */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const tipUrl = `${appUrl}/cafe/${params.slug}`;

  try {
    const qrBuffer = await QRCode.toBuffer(tipUrl, {
      type: "png",
      width: 512,
      margin: 2,
      color: {
        dark: "#1F2937",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H", // High error correction for printed QR codes
    });

    // Convert Buffer to Uint8Array for Response compatibility
    const uint8 = new Uint8Array(qrBuffer);

    return new Response(uint8, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "خطا در ساخت QR کد" },
      { status: 500 }
    );
  }
}
