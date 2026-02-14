import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

/** Admin: list all registered cafés with their stats */
export default async function AdminCafesPage() {
  const cafes = await prisma.cafe.findMany({
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { tips: true, payouts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">کافه‌ها</h1>
        <span className="text-sm text-gray-500 bg-secondary px-3 py-1 rounded-lg">
          {cafes.length} کافه
        </span>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
              </tr>
            </thead>
            <tbody>
              {cafes.map((cafe) => (
                <tr
                  key={cafe.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cafes.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            هنوز کافه‌ای ثبت‌نام نکرده
          </p>
        )}
      </div>
    </div>
  );
}
