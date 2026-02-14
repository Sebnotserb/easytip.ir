import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import ReviewCard from "@/components/ReviewCard";
import { formatDate } from "@/lib/utils";

/** Reviews page — shows all customer reviews/ratings for the café */
export default async function ReviewsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const cafe = await prisma.cafe.findFirst({
    where: { ownerId: session.userId },
  });
  if (!cafe) redirect("/auth/login");

  const tips = await prisma.tip.findMany({
    where: {
      cafeId: cafe.id,
      status: "PAID",
      OR: [{ rating: { not: null } }, { comment: { not: null } }],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Calculate stats
  const avgRating = await prisma.tip.aggregate({
    where: { cafeId: cafe.id, status: "PAID", rating: { not: null } },
    _avg: { rating: true },
    _count: true,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">نظرات مشتریان</h1>
        {avgRating._count > 0 && (
          <div className="bg-secondary px-4 py-2 rounded-xl">
            <span className="text-sm text-gray-600">میانگین: </span>
            <span className="font-bold text-primary">
              {avgRating._avg.rating?.toFixed(1)} ⭐
            </span>
            <span className="text-xs text-gray-400 mr-2">
              ({avgRating._count} نظر)
            </span>
          </div>
        )}
      </div>

      {tips.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-400 text-lg">هنوز نظری ثبت نشده</p>
          <p className="text-gray-300 text-sm mt-2">
            نظرات مشتریان پس از پرداخت انعام در اینجا نمایش داده می‌شود
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip) => (
            <ReviewCard
              key={tip.id}
              nickname={tip.nickname || undefined}
              rating={tip.rating || 0}
              comment={tip.comment || undefined}
              amount={tip.amount}
              date={formatDate(tip.createdAt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
