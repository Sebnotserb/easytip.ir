"use client";

import { useState } from "react";
import StarRating from "./StarRating";

const PRESET_AMOUNTS = [50_000, 150_000, 500_000, 1_000_000];
const COMMISSION_RATE = 0.05;
const MIN_TIP = 1_000;
const MAX_TIP = 5_000_000;

interface TipFormProps {
  cafeId: string;
  cafeName: string;
  cafeMessage?: string;
  cafeLogo?: string;
  cafeInstagram?: string;
}

export default function TipForm({
  cafeId,
  cafeName,
  cafeMessage,
  cafeLogo,
  cafeInstagram,
}: TipFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [rating, setRating] = useState(0);
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [showExtras, setShowExtras] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedAmount = isCustom ? parseInt(customAmount) || 0 : amount;
  const commission = Math.ceil(selectedAmount * COMMISSION_RATE);
  const total = selectedAmount + commission;
  const isValid = selectedAmount >= MIN_TIP && selectedAmount <= MAX_TIP;

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setIsCustom(false);
    setCustomAmount("");
    setError("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setIsCustom(true);
    setAmount(0);
    setError("");
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cafeId,
          amount: selectedAmount,
          rating: rating || undefined,
          nickname: nickname.trim() || undefined,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "مشکلی پیش اومد — لطفاً دوباره امتحان کنید");
        return;
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch {
      setError("اتصال برقرار نشد — لطفاً اینترنت‌تون رو چک کنید");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString("fa-IR");

  return (
    <div className="max-w-md mx-auto">
      {/* ── Café Branding ── */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden shadow-card border-2 border-white">
          {cafeLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cafeLogo} alt={cafeName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">☕</span>
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-dark mb-1">{cafeName}</h1>
        <p className="text-muted text-sm leading-relaxed">
          {cafeMessage || "خوشحال می‌شیم حمایتمون کنید 💚"}
        </p>
      </div>

      {/* ═══ AMOUNT SELECTION (Primary action — first!) ═══ */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 mb-4">
        <p className="text-sm font-bold text-dark mb-3">مبلغ انعام رو انتخاب کنید</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {PRESET_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handlePresetClick(val)}
              className={`py-4 rounded-2xl font-bold text-lg transition-all btn-press ${
                amount === val && !isCustom
                  ? "bg-cta text-white shadow-lg shadow-cta/25 scale-[1.03]"
                  : "bg-gray-50 text-dark hover:bg-secondary border border-gray-100"
              }`}
            >
              {fmt(val)}
              {val === 1_000_000 && (
                <span className="block text-xs font-normal mt-0.5 opacity-70">تومان</span>
              )}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <input
          type="number"
          inputMode="numeric"
          placeholder="یا مبلغ دلخواه وارد کنید..."
          value={customAmount}
          onChange={handleCustomChange}
          min={MIN_TIP}
          max={MAX_TIP}
          className={`w-full p-3.5 rounded-2xl border-2 text-center font-bold transition-all ${
            isCustom && customAmount
              ? "border-cta bg-secondary text-dark"
              : "border-gray-200 text-muted"
          }`}
        />
      </div>

      {/* ── Fee Breakdown ── */}
      {selectedAmount > 0 && (
        <div className="bg-white rounded-2xl p-4 mb-4 animate-fade-in-up shadow-card-sm border border-gray-100">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-muted">مبلغ انعام</span>
            <span className="font-bold text-dark">{fmt(selectedAmount)} تومان</span>
          </div>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-muted">کارمزد سرویس (۵٪)</span>
            <span className="text-muted">{fmt(commission)} تومان</span>
          </div>
          <hr className="my-2.5 border-gray-100" />
          <div className="flex justify-between">
            <span className="font-bold text-dark">جمع کل</span>
            <span className="font-extrabold text-cta text-lg">
              {fmt(total)} تومان
            </span>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-2xl mb-4 text-sm text-center border border-red-100">
          {error}
        </div>
      )}

      {/* ── Submit Button ── */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid || loading}
        className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all btn-press ${
          isValid && !loading
            ? "bg-cta hover:bg-cta-hover shadow-lg shadow-cta/20 hover:shadow-xl"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <span className="animate-pulse-soft">در حال اتصال به درگاه...</span>
        ) : (
          "پرداخت انعام"
        )}
      </button>

      {/* ── Trust Badge ── */}
      <div className="flex items-center justify-center gap-1.5 mt-3 mb-2">
        <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-xs text-muted">پرداخت امن از طریق درگاه زرین‌پال</span>
      </div>

      {/* ═══ OPTIONAL SECTION (expandable) ═══ */}
      <div className="mt-5 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => setShowExtras(!showExtras)}
          className="w-full flex items-center justify-between text-sm text-muted hover:text-dark transition-colors py-1"
        >
          <span>امتیاز و نظر بدید (اختیاری)</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showExtras ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showExtras && (
          <div className="mt-4 space-y-4 animate-fade-in-up">
            {/* Star Rating */}
            <div className="text-center">
              <p className="text-xs text-muted mb-2">تجربه‌تون چطور بود؟</p>
              <StarRating value={rating} onChange={setRating} />
            </div>

            {/* Name & Comment */}
            <input
              type="text"
              placeholder="اسمتون (اختیاری)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={50}
              className="w-full p-3 rounded-2xl border-2 border-gray-200 focus:border-primary transition-all text-sm"
            />
            <textarea
              placeholder="یه نظر یا پیشنهاد دارید؟ (اختیاری)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={2}
              className="w-full p-3 rounded-2xl border-2 border-gray-200 focus:border-primary transition-all resize-none text-sm"
            />
          </div>
        )}
      </div>

      {/* ── Instagram Link ── */}
      {cafeInstagram && (
        <a
          href={`https://instagram.com/${cafeInstagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-5 py-3 px-4 rounded-2xl bg-gradient-to-l from-purple-50 to-pink-50 border border-purple-100 hover:from-purple-100 hover:to-pink-100 transition-all group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/instagram.svg"
            alt="Instagram"
            className="w-5 h-5 group-hover:scale-110 transition-transform"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors" dir="ltr">
            @{cafeInstagram}
          </span>
          <span className="text-xs text-gray-400">
            را در اینستاگرام دنبال کنید
          </span>
        </a>
      )}
    </div>
  );
}
