import prisma from "@/lib/db";
import StatsCard from "@/components/StatsCard";

export const dynamic = "force-dynamic";

/** Admin dashboard — platform-wide statistics overview */
export default async function AdminPage() {
  const [cafeCount, tipStats, pendingPayouts, totalPayouts] =
    await Promise.all([
      prisma.cafe.count(),
      prisma.tip.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true, commission: true },
        _count: true,
      }),
      prisma.payout.count({ where: { status: "PENDING" } }),
      prisma.payout.aggregate({
        where: { status: "COMPLETED" },
        _sum: { netAmount: true },
      }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-dark">پنل مدیریت</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="تعداد کافه‌ها"
          value={cafeCount.toLocaleString("fa-IR")}
          icon="☕"
        />
        <StatsCard
          title="کل انعام‌ها"
          value={`${(tipStats._sum.amount || 0).toLocaleString("fa-IR")} تومان`}
          icon="💰"
        />
        <StatsCard
          title="درآمد کمیسیون"
          value={`${(tipStats._sum.commission || 0).toLocaleString("fa-IR")} تومان`}
          icon="📈"
        />
        <StatsCard
          title="تعداد تراکنش‌ها"
          value={(tipStats._count || 0).toLocaleString("fa-IR")}
          icon="💳"
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h3 className="font-bold mb-4 text-dark">برداشت‌های در انتظار</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {pendingPayouts.toLocaleString("fa-IR")}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            نیاز به بررسی و پردازش
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h3 className="font-bold mb-4 text-dark">کل واریزی‌ها</h3>
          <p className="text-3xl font-bold text-primary">
            {(totalPayouts._sum.netAmount || 0).toLocaleString("fa-IR")} تومان
          </p>
          <p className="text-sm text-gray-400 mt-1">
            مبلغ واریز شده به کافه‌ها
          </p>
        </div>
      </div>
    </div>
  );
}
