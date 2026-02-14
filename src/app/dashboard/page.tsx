import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import StatsCard from "@/components/StatsCard";
import TipChart from "@/components/TipChart";
import ReviewCard from "@/components/ReviewCard";
import { formatNumber, formatDate } from "@/lib/utils";

/**
 * Main dashboard page for café owners.
 * Displays stats, monthly chart, and recent reviews.
 */
export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const cafe = await prisma.cafe.findFirst({
    where: { ownerId: session.userId },
  });
  if (!cafe) redirect("/auth/login");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch all stats in parallel
  const [totalTips, todayTips, monthTips, recentReviews, avgRating] =
    await Promise.all([
      prisma.tip.aggregate({
        where: { cafeId: cafe.id, status: "PAID" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.tip.aggregate({
        where: {
          cafeId: cafe.id,
          status: "PAID",
          createdAt: { gte: todayStart },
        },
        _sum: { amount: true },
      }),
      prisma.tip.aggregate({
        where: {
          cafeId: cafe.id,
          status: "PAID",
          createdAt: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
      prisma.tip.findMany({
        where: {
          cafeId: cafe.id,
          status: "PAID",
          OR: [{ rating: { not: null } }, { comment: { not: null } }],
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.tip.aggregate({
        where: { cafeId: cafe.id, status: "PAID", rating: { not: null } },
        _avg: { rating: true },
      }),
    ]);

  // Build chart data for last 6 months
  const months = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
  ];
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const agg = await prisma.tip.aggregate({
      where: {
        cafeId: cafe.id,
        status: "PAID",
        createdAt: { gte: d, lt: next },
      },
      _sum: { amount: true },
    });
    chartData.push({
      month: months[d.getMonth() % 12],
      amount: agg._sum.amount || 0,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true },
  });

  return (
    <div>
      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-l from-secondary to-white rounded-2xl p-6 mb-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-card-sm overflow-hidden flex-shrink-0">
            {cafe.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cafe.logo} alt={cafe.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">☕</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-dark">
              سلام {user?.name?.split(" ")[0] || ""}، خسته نباشید
            </h1>
            <p className="text-muted text-sm mt-0.5">{cafe.name} — داشبورد مدیریت</p>
          </div>
        </div>
      </div>

      {/* ── Statistics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="کل انعام‌ها"
          value={`${formatNumber(totalTips._sum.amount || 0)} تومان`}
          icon="total"
        />
        <StatsCard
          title="انعام امروز"
          value={`${formatNumber(todayTips._sum.amount || 0)} تومان`}
          icon="today"
        />
        <StatsCard
          title="موجودی کیف‌پول"
          value={`${formatNumber(cafe.walletBalance)} تومان`}
          icon="wallet"
        />
        <StatsCard
          title="میانگین امتیاز"
          value={
            avgRating._avg.rating
              ? `${avgRating._avg.rating.toFixed(1)} / ۵`
              : "بدون امتیاز"
          }
          icon="rating"
        />
      </div>

      {/* ── Monthly Chart ── */}
      <div className="mb-8">
        <TipChart data={chartData} />
      </div>

      {/* ── Recent Reviews ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-dark">آخرین نظرات</h2>
        {recentReviews.length > 0 && (
          <a
            href="/dashboard/reviews"
            className="text-primary text-sm font-bold hover:underline"
          >
            مشاهده همه
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recentReviews.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-card-sm">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <p className="text-muted text-sm font-bold mb-1">هنوز نظری ثبت نشده</p>
            <p className="text-gray-400 text-xs">QR کد رو روی میزها بذارید تا مشتری‌ها نظرشون رو بگن</p>
          </div>
        ) : (
          recentReviews.map((tip) => (
            <ReviewCard
              key={tip.id}
              nickname={tip.nickname || undefined}
              rating={tip.rating || 0}
              comment={tip.comment || undefined}
              amount={tip.amount}
              date={formatDate(tip.createdAt)}
            />
          ))
        )}
      </div>
    </div>
  );
}
