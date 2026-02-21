"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

function formatToman(value: number, locale: string = "fa"): string {
  return value.toLocaleString(locale === "en" ? "en-US" : "fa-IR");
}

function SuccessIcon() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full border-2 border-primary/40 ring-burst" />
      <div className="absolute inset-0 rounded-full bg-green-50 border-[3px] border-primary success-circle-pop" />
      <div className="absolute inset-0 flex items-center justify-center success-check-pop">
        <svg
          className="w-14 h-14 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}

function DemoSuccessContent() {
  const { t, locale, dir } = useI18n();
  const isEn = locale === "en";
  const params = useSearchParams();
  const amountParam = params.get("amount");
  const amount = amountParam ? parseInt(amountParam, 10) : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary via-white to-secondary/30 flex items-center justify-center p-4" dir={dir}>
      <div className="text-center max-w-md w-full">
        {/* Demo Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🎯</span>
            <p className="text-sm font-bold text-amber-700">
              {isEn ? "This was a demo — no real payment was made" : "این یک نسخه نمایشی بود — پرداخت واقعی انجام نشد"}
            </p>
          </div>
        </div>

        <SuccessIcon />

        <h1 className="stagger-fade-in delay-600 text-3xl font-extrabold text-dark mb-3">
          {t("thanks.successTitle")}
        </h1>

        <p className="stagger-fade-in delay-800 text-muted mb-8 leading-relaxed">
          {isEn
            ? "This is what your customers will see after a successful tip"
            : "مشتری‌های شما بعد از پرداخت موفق انعام، این صفحه رو می‌بینن"}
        </p>

        {/* Receipt Card */}
        <div className="slide-up-bounce delay-1000 bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="border-b-2 border-dashed border-gray-200 pb-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-green-600 font-bold">{t("thanks.paymentSuccess")}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {amount && !isNaN(amount) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("thanks.amountPaid")}</span>
                <span className="text-dark font-extrabold text-base">
                  {formatToman(amount, locale)} {t("tip.toman")}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{t("thanks.status")}</span>
              <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                {t("thanks.confirmed")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{t("thanks.paymentMethod")}</span>
              <span className="text-dark font-bold">{t("thanks.zarinpal")}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
            <p className="text-xs text-gray-400">
              {t("thanks.receiptNote")}
            </p>
          </div>
        </div>

        {/* CTA to register */}
        <div className="stagger-fade-in delay-1200 space-y-3">
          <Link
            href="/auth/register"
            className="inline-block bg-cta text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cta-hover transition-all shadow-lg shadow-cta/20 hover:shadow-xl btn-press"
          >
            {isEn ? "Create Your Free Account" : "حساب رایگان بسازید"}
          </Link>
          <div>
            <Link
              href="/"
              className="inline-block text-primary font-bold hover:underline transition-all mt-2"
            >
              {t("thanks.backHome")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DemoSuccessPage() {
  const { t } = useI18n();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-secondary">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">{t("thanks.checking")}</p>
          </div>
        </div>
      }
    >
      <DemoSuccessContent />
    </Suspense>
  );
}
