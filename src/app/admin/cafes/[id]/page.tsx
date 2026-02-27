import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

/** Admin: single cafe details page */
export default async function AdminCafeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const cafe = await prisma.cafe.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { name: true, email: true, phone: true, createdAt: true } },
      _count: { select: { tips: true, payouts: true } },
      tips: {
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!cafe) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const tipUrl = `${appUrl}/cafe/${cafe.slug}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark">اطلاعات کافه</h1>
        <Link
          href="/admin/cafes"
          className="text-sm font-bold text-gray-600 hover:text-dark transition-colors"
        >
          بازگشت به لیست کافه‌ها
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden border border-gray-200 flex items-center justify-center">
              {cafe.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cafe.logo} alt={cafe.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">☕</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-dark">{cafe.name}</h2>
              <p className="text-sm text-gray-400" dir="ltr">
                /{cafe.slug}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-gray-500 mb-1">آدرس صفحه انعام</p>
              <p className="font-bold text-dark break-all" dir="ltr">{tipUrl}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-gray-500 mb-1">وضعیت</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  cafe.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {cafe.isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-gray-500 mb-1">اینستاگرام</p>
              <p className="font-bold text-dark" dir="ltr">
                {cafe.instagram ? `@${cafe.instagram}` : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-gray-500 mb-1">تلگرام (Chat ID)</p>
              <p className="font-bold text-dark" dir="ltr">
                {cafe.telegramChatId || "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/api/qr/${cafe.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              پیش‌نمایش QR
            </a>
            <a
              href={`/api/qr/${cafe.slug}?download=true`}
              className="px-4 py-2 rounded-xl bg-dark text-white text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              دانلود QR
            </a>
            <a
              href={tipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-primary text-dark text-sm font-bold hover:bg-primary-dark hover:text-white transition-colors"
            >
              باز کردن صفحه انعام
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <h3 className="font-extrabold text-dark">مالک کافه</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p><span className="text-gray-500">نام:</span> {cafe.owner.name}</p>
            <p dir="ltr"><span className="text-gray-500">Email:</span> {cafe.owner.email}</p>
            <p dir="ltr"><span className="text-gray-500">Phone:</span> {cafe.owner.phone || "—"}</p>
          </div>
          <hr className="border-gray-100" />
          <h3 className="font-extrabold text-dark">آمار</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p><span className="text-gray-500">تعداد انعام:</span> {cafe._count.tips.toLocaleString("fa-IR")}</p>
            <p><span className="text-gray-500">تعداد برداشت:</span> {cafe._count.payouts.toLocaleString("fa-IR")}</p>
            <p><span className="text-gray-500">موجودی:</span> {cafe.walletBalance.toLocaleString("fa-IR")} تومان</p>
            <p><span className="text-gray-500">کل دریافتی:</span> {cafe.totalTips.toLocaleString("fa-IR")} تومان</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-extrabold text-dark mb-4">آخرین انعام‌ها</h3>
        {cafe.tips.length === 0 ? (
          <p className="text-sm text-gray-400">هنوز انعامی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-gray-500 border-b border-gray-100">
                  <th className="py-2">شناسه</th>
                  <th className="py-2">مبلغ</th>
                  <th className="py-2">وضعیت</th>
                  <th className="py-2">زمان</th>
                </tr>
              </thead>
              <tbody>
                {cafe.tips.map((tip) => (
                  <tr key={tip.id} className="border-b border-gray-50">
                    <td className="py-2 text-gray-400" dir="ltr">{tip.id.slice(0, 8)}...</td>
                    <td className="py-2 font-bold text-dark">{tip.amount.toLocaleString("fa-IR")} تومان</td>
                    <td className="py-2">{tip.status}</td>
                    <td className="py-2 text-gray-500">{new Date(tip.createdAt).toLocaleString("fa-IR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

