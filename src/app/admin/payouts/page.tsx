import prisma from "@/lib/db";
import { formatNumber, formatDateShort } from "@/lib/utils";
import PayoutActions from "./PayoutActions";

export const dynamic = "force-dynamic";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار", color: "bg-yellow-50 text-yellow-600" },
  PROCESSING: { label: "در حال پردازش", color: "bg-blue-50 text-blue-600" },
  COMPLETED: { label: "تکمیل شده", color: "bg-green-50 text-green-600" },
  REJECTED: { label: "رد شده", color: "bg-red-50 text-red-600" },
};

export default async function AdminPayoutsPage() {
  const payouts = await prisma.payout.findMany({
    include: {
      cafe: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const pending = payouts.filter((p) => p.status === "PENDING").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">درخواست‌های برداشت</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pending > 0
              ? `${pending} درخواست در انتظار بررسی`
              : "همه درخواست‌ها بررسی شده‌اند"}
          </p>
        </div>
      </div>

      {payouts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          هنوز درخواست برداشتی ثبت نشده
        </div>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => {
            const st = statusMap[payout.status] || statusMap.PENDING;
            return (
              <div
                key={payout.id}
                className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-dark">
                        {payout.cafe.name}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${st.color}`}
                      >
                        {st.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                      <span>
                        مبلغ:{" "}
                        <strong className="text-dark">
                          {formatNumber(payout.amount)} تومان
                        </strong>
                      </span>
                      <span>
                        کارمزد:{" "}
                        <strong className="text-dark">
                          {formatNumber(payout.fee)} تومان
                        </strong>
                      </span>
                      <span>
                        خالص:{" "}
                        <strong className="text-primary">
                          {formatNumber(payout.netAmount)} تومان
                        </strong>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                      {payout.bankInfo && (
                        <span>اطلاعات بانکی: {payout.bankInfo}</span>
                      )}
                      <span>تاریخ: {formatDateShort(payout.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {payout.status === "PENDING" ||
                  payout.status === "PROCESSING" ? (
                    <PayoutActions
                      payoutId={payout.id}
                      currentStatus={payout.status}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
