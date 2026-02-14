"use client";

import { useState, useEffect } from "react";

interface Payout {
  id: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: string;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار", color: "text-yellow-600 bg-yellow-50" },
  PROCESSING: { label: "در حال پردازش", color: "text-blue-600 bg-blue-50" },
  COMPLETED: { label: "واریز شده", color: "text-green-600 bg-green-50" },
  REJECTED: { label: "رد شده", color: "text-red-600 bg-red-50" },
};

/** Withdrawal management page for café owners */
export default function WithdrawalsPage() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [amount, setAmount] = useState("");
  const [bankInfo, setBankInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/withdrawals");
      const data = await res.json();
      setWalletBalance(data.walletBalance || 0);
      setPayouts(data.payouts || []);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const parsedAmount = parseInt(amount) || 0;
  const withdrawalFee =
    parsedAmount >= 500_000 ? 0 : Math.ceil(parsedAmount * 0.1);
  const netAmount = parsedAmount - withdrawalFee;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parsedAmount, bankInfo }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ثبت درخواست");
        return;
      }

      setSuccess("درخواست برداشت با موفقیت ثبت شد ✓");
      setAmount("");
      setBankInfo("");
      fetchData();
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse-soft text-gray-400">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-dark">مدیریت برداشت</h1>

      {/* ── Wallet Balance Card ── */}
      <div className="bg-gradient-to-l from-primary to-green-600 rounded-2xl p-6 text-white mb-8">
        <p className="text-sm opacity-80 mb-1">موجودی کیف‌پول</p>
        <p className="text-3xl font-bold">
          {walletBalance.toLocaleString()} تومان
        </p>
        {walletBalance > 0 && walletBalance < 500_000 && (
          <p className="text-xs opacity-70 mt-2">
            ⚠️ برداشت زیر ۵۰۰,۰۰۰ تومان شامل ۱۰٪ کارمزد می‌شود
          </p>
        )}
      </div>

      {/* ── Withdrawal Form ── */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-8">
        <h2 className="text-lg font-bold mb-5 text-dark">درخواست برداشت</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              مبلغ (تومان)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
                setSuccess("");
              }}
              required
              min={10_000}
              max={walletBalance}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
              placeholder="مبلغ مورد نظر برای برداشت"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              شماره شبا یا شماره کارت
            </label>
            <input
              type="text"
              value={bankInfo}
              onChange={(e) => setBankInfo(e.target.value)}
              required
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
              placeholder="IR000000000000000000000000 یا شماره کارت ۱۶ رقمی"
              dir="ltr"
            />
          </div>

          {/* Fee Breakdown */}
          {parsedAmount > 0 && (
            <div className="bg-secondary rounded-xl p-4 animate-fade-in-up">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">مبلغ برداشت</span>
                <span className="font-bold">
                  {parsedAmount.toLocaleString()} تومان
                </span>
              </div>
              {withdrawalFee > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">کارمزد (۱۰٪)</span>
                  <span className="text-red-500">
                    −{withdrawalFee.toLocaleString()} تومان
                  </span>
                </div>
              )}
              {withdrawalFee === 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">کارمزد</span>
                  <span className="text-green-600 font-bold">رایگان ✓</span>
                </div>
              )}
              <hr className="my-2 border-gray-300" />
              <div className="flex justify-between font-bold">
                <span>مبلغ دریافتی</span>
                <span className="text-primary">
                  {netAmount.toLocaleString()} تومان
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading || parsedAmount < 10_000 || parsedAmount > walletBalance
            }
            className="w-full py-3 bg-cta text-white rounded-xl font-bold hover:bg-green-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "در حال ثبت..." : "ثبت درخواست برداشت"}
          </button>
        </form>
      </div>

      {/* ── Payout History ── */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
        <h2 className="text-lg font-bold mb-5 text-dark">تاریخچه برداشت‌ها</h2>
        {payouts.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            هنوز درخواست برداشتی ثبت نشده
          </p>
        ) : (
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-bold text-dark">
                    {payout.netAmount.toLocaleString()} تومان
                  </p>
                  {payout.fee > 0 && (
                    <p className="text-xs text-gray-400">
                      کارمزد: {payout.fee.toLocaleString()} تومان
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(payout.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                    statusLabels[payout.status]?.color || ""
                  }`}
                >
                  {statusLabels[payout.status]?.label || payout.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
