import Link from "next/link";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

/** Admin: list all registered cafés with their stats */
export default async function AdminCafesPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = (searchParams?.q || "").trim();

  const cafes = await prisma.cafe.findMany({
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { tips: true, payouts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const normalizedQuery = query.toLowerCase();
  const filteredCafes = !normalizedQuery
    ? cafes
    : cafes.filter((cafe) => {
        const fields = [
          cafe.name,
          cafe.slug,
          cafe.owner?.name || "",
          cafe.owner?.email || "",
        ];
        return fields.some((field) =>
          field.toLowerCase().includes(normalizedQuery)
        );
      });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark">کافه‌ها</h1>
          <span className="text-sm text-gray-500 bg-secondary px-3 py-1 rounded-lg">
            {filteredCafes.length} / {cafes.length} کافه
          </span>
        </div>
        <form method="GET" className="w-full md:w-auto md:min-w-[360px]">
          <div className="relative">
            <input
              name="q"
              defaultValue={query}
              placeholder="جستجو بر اساس نام کافه، اسلاگ، نام یا ایمیل مالک..."
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-dark focus:border-primary transition-all"
            />
            <button
              type="submit"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg bg-dark px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              جستجو
            </button>
          </div>
        </form>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-600">
                  انتخاب
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  نام کافه
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  مالک
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  انعام‌ها
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  موجودی
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  کل دریافتی
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  وضعیت
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  QR کد
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  اطلاعات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCafes.map((cafe) => (
                <tr
                  key={cafe.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`انتخاب ${cafe.name}`}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-dark">{cafe.name}</p>
                      <p className="text-xs text-gray-400" dir="ltr">
                        /{cafe.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-dark">{cafe.owner.name}</p>
                      <p className="text-xs text-gray-400" dir="ltr">
                        {cafe.owner.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    {cafe._count.tips.toLocaleString("fa-IR")}
                  </td>
                  <td className="px-6 py-4">
                    {cafe.walletBalance.toLocaleString("fa-IR")} تومان
                  </td>
                  <td className="px-6 py-4">
                    {cafe.totalTips.toLocaleString("fa-IR")} تومان
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cafe.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {cafe.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/qr/${cafe.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        پیش‌نمایش QR
                      </a>
                      <a
                        href={`/api/qr/${cafe.slug}?download=true`}
                        className="text-xs px-3 py-1.5 rounded-lg bg-dark text-white hover:bg-slate-800 transition-colors"
                      >
                        دانلود QR
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/cafes/${cafe.id}`}
                      className="inline-block text-xs px-3 py-1.5 rounded-lg bg-primary text-dark font-bold hover:bg-primary-dark hover:text-white transition-colors"
                    >
                      مشاهده اطلاعات
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCafes.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            {query ? "نتیجه‌ای برای این جستجو پیدا نشد" : "هنوز کافه‌ای ثبت‌نام نکرده"}
          </p>
        )}
      </div>
    </div>
  );
}
