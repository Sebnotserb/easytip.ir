import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * QR Code page — displays and allows downloading
 * the café's unique QR code for table placement.
 */
export default async function QRPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const cafe = await prisma.cafe.findFirst({
    where: { ownerId: session.userId },
  });
  if (!cafe) redirect("/auth/login");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const tipUrl = `${appUrl}/cafe/${cafe.slug}`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-dark">کد QR اختصاصی</h1>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100 text-center">
          {/* Instructions */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              این QR کد را چاپ کرده و روی میزهای کافه قرار دهید.
              <br />
              مشتریان با اسکن آن به صفحه انعام هدایت می‌شوند.
            </p>
          </div>

          {/* QR Code Image */}
          <div className="bg-white rounded-2xl p-4 border-2 border-dashed border-gray-200 mb-6 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/qr/${cafe.slug}`}
              alt={`QR Code - ${cafe.name}`}
              className="w-56 h-56 mx-auto"
              width={224}
              height={224}
            />
          </div>

          {/* Café Name */}
          <p className="font-bold text-dark text-lg mb-2">{cafe.name}</p>

          {/* URL */}
          <p
            className="text-xs text-gray-400 mb-6 break-all bg-gray-50 rounded-lg p-2"
            dir="ltr"
          >
            {tipUrl}
          </p>

          {/* Download Button */}
          <a
            href={`/api/qr/${cafe.slug}?download=true`}
            download={`qr-${cafe.slug}.png`}
            className="inline-block bg-cta text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-all"
          >
            دانلود QR کد 📥
          </a>

          {/* Print tip */}
          <p className="text-xs text-gray-400 mt-4">
            💡 پیشنهاد: QR کد را در اندازه ۵×۵ سانتی‌متر چاپ کنید
          </p>
        </div>
      </div>
    </div>
  );
}
