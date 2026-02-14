import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار", color: "text-yellow-600 bg-yellow-50" },
  COMPLETED: { label: "موفق", color: "text-green-600 bg-green-50" },
  FAILED: { label: "ناموفق", color: "text-red-600 bg-red-50" },
};

const typeLabels: Record<string, string> = {
  TIP_PAYMENT: "انعام",
  PAYOUT: "برداشت",
};

/** Admin: list all transactions across the platform */
export default async function AdminTransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      tip: {
        include: { cafe: { select: { name: true } } },
      },
      payout: {
        include: { cafe: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">تراکنش‌ها</h1>
        <span className="text-sm text-gray-500 bg-secondary px-3 py-1 rounded-lg">
          آخرین ۱۰۰ تراکنش
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  کافه
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  مبلغ
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  نوع
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  وضعیت
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  شناسه
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                  تاریخ
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const cafeName =
                  tx.tip?.cafe?.name || tx.payout?.cafe?.name || "—";
                return (
                  <tr
                    key={tx.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-dark">
                      {cafeName}
                    </td>
                    <td className="px-6 py-4">
                      {tx.amount.toLocaleString("fa-IR")} تومان
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {typeLabels[tx.type] || tx.type}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          statusLabels[tx.status]?.color || ""
                        }`}
                      >
                        {statusLabels[tx.status]?.label || tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400" dir="ltr">
                      {tx.reference || tx.authority?.slice(0, 12) || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            هنوز تراکنشی ثبت نشده
          </p>
        )}
      </div>
    </div>
  );
}
