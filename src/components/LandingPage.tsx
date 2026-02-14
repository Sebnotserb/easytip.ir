"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";
import FooterContact from "./FooterContact";

export default function LandingPage() {
  const { t, locale, dir } = useI18n();
  const isEn = locale === "en";

  return (
    <main className="min-h-screen" dir={dir}>
      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-dark">
            {isEn ? (
              <>Easy<span className="text-primary">Tip</span></>
            ) : (
              <>ایزی‌<span className="text-primary">تیپ</span></>
            )}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/auth/login"
              className="text-muted hover:text-dark transition-colors px-4 py-2 text-sm font-bold"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/auth/register"
              className="bg-cta text-white px-5 py-2.5 rounded-xl font-bold hover:bg-cta-hover transition-all text-sm btn-press shadow-sm"
            >
              {t("nav.register")}
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════ Hero Section ══════════ */}
      <section className="bg-gradient-to-b from-secondary via-white to-white py-16 md:py-24 px-4 overflow-hidden">
        <div className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12`}>
          {/* Text side */}
          <div className={`flex-1 text-center ${isEn ? "md:text-left" : "md:text-right"}`}>
            <div className="inline-block bg-accent-light text-accent text-xs font-bold px-3 py-1.5 rounded-full mb-5">
              {t("hero.badge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark mb-5 leading-[1.3]">
              {t("hero.title1")}
              <br />
              <span className="text-primary">{t("hero.title2")}</span>{isEn ? "." : ` ${t("hero.title3")}`}
            </h1>
            <p className={`text-lg text-muted mb-8 max-w-lg leading-relaxed ${isEn ? "md:mx-0 mx-auto" : "md:mx-0 mx-auto"}`}>
              {isEn ? (
                t("hero.subtitle")
              ) : (
                <>
                  یه راه‌حل مدرن و مبتنی بر QR کد که مشتری‌ها بدون دردسر قدردانی‌شون رو نشون بدن — و شما تا <span className="font-extrabold text-dark">۸۰٪</span> رشد در دریافت انعام رو از همون لحظه تجربه کنید.
                </>
              )}
            </p>
            <div className={`flex flex-col sm:flex-row gap-3 justify-center ${isEn ? "md:justify-start" : "md:justify-start"}`}>
              <Link
                href="/auth/register"
                className="bg-cta text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cta-hover transition-all shadow-lg shadow-cta/20 hover:shadow-xl btn-press"
              >
                {t("hero.cta")}
              </Link>
              <Link
                href="#how-it-works"
                className="bg-white text-dark px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all border border-gray-200 btn-press"
              >
                {t("hero.secondary")}
              </Link>
            </div>
          </div>

          {/* Phone mockup side */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {/* Phone frame */}
              <div className="w-[280px] md:w-[300px] bg-dark rounded-[3rem] p-3 shadow-card-lg">
                <div className="bg-white rounded-[2.3rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-secondary px-6 py-3 flex items-center justify-between">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted/40" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted/40" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted/40" />
                    </div>
                    <div className="text-[10px] text-muted font-bold">{isEn ? "12:30" : "۱۲:۳۰"}</div>
                  </div>
                  {/* Mock tipping page */}
                  <div className="px-5 py-6">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">☕</span>
                    </div>
                    <p className="text-center font-extrabold text-dark text-sm mb-1">
                      {isEn ? "Café Lamiz" : "کافه لمیز"}
                    </p>
                    <p className="text-center text-[10px] text-muted mb-4">
                      {isEn ? "We'd love your support" : "خوشحال می‌شیم حمایتمون کنید"}
                    </p>
                    {/* Amount buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-xl py-2.5 text-center text-xs font-bold text-dark border border-gray-100">{isEn ? "50,000" : "۵۰,۰۰۰"}</div>
                      <div className="bg-cta rounded-xl py-2.5 text-center text-xs font-bold text-white shadow-sm">{isEn ? "150,000" : "۱۵۰,۰۰۰"}</div>
                      <div className="bg-gray-50 rounded-xl py-2.5 text-center text-xs font-bold text-dark border border-gray-100">{isEn ? "500,000" : "۵۰۰,۰۰۰"}</div>
                      <div className="bg-gray-50 rounded-xl py-2.5 text-center text-xs font-bold text-dark border border-gray-100">{isEn ? "1,000,000" : "۱,۰۰۰,۰۰۰"}</div>
                    </div>
                    <div className="bg-cta text-white rounded-xl py-2.5 text-center text-xs font-bold">
                      {isEn ? "Pay Tip" : "پرداخت انعام"}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <svg className="w-2.5 h-2.5 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-[8px] text-muted/60">{isEn ? "Secure payment" : "پرداخت امن"}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className={`absolute -bottom-3 ${isEn ? "-left-4" : "-right-4"} bg-white rounded-2xl shadow-card-lg px-4 py-2.5 border border-gray-100`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted">{isEn ? "Tip received" : "انعام دریافت شد"}</p>
                    <p className="text-xs font-extrabold text-dark">{isEn ? "150,000" : "۱۵۰,۰۰۰"} {isEn ? "Toman" : "تومان"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ Social Proof Bar ══════════ */}
      <section className="py-8 px-4 border-y border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-dark">{t("proof.fee")}</p>
            <p className="text-xs text-muted mt-1">{t("proof.feeLabel")}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden md:block" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-dark">{t("proof.time")}</p>
            <p className="text-xs text-muted mt-1">{t("proof.timeLabel")}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden md:block" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-dark">{t("proof.noApp")}</p>
            <p className="text-xs text-muted mt-1">{t("proof.noAppLabel")}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden md:block" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-dark">{t("proof.free")}</p>
            <p className="text-xs text-muted mt-1">{t("proof.freeLabel")}</p>
          </div>
        </div>
      </section>

      {/* ══════════ How It Works ══════════ */}
      <section id="how-it-works" className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-3">
            {t("how.title")}
          </h2>
          <p className="text-muted text-center mb-14 max-w-lg mx-auto leading-relaxed whitespace-pre-line">
            {t("how.subtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: isEn ? "1" : "۱",
                title: t("how.step1.title"),
                desc: t("how.step1.desc"),
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75H16.5v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75H16.5v-.75z" />
                  </svg>
                ),
              },
              {
                step: isEn ? "2" : "۲",
                title: t("how.step2.title"),
                desc: t("how.step2.desc"),
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                ),
              },
              {
                step: isEn ? "3" : "۳",
                title: t("how.step3.title"),
                desc: t("how.step3.desc"),
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center bg-white rounded-3xl p-8 shadow-card border border-gray-100 card-hover"
              >
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {item.icon}
                </div>
                <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                  {t("how.step")} {item.step}
                </div>
                <h3 className="text-lg font-extrabold mb-2 text-dark">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ Features ══════════ */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-3">
            {t("features.title")}
          </h2>
          <p className="text-muted text-center mb-14 max-w-md mx-auto">
            {t("features.subtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(isEn ? [
              { title: "No upfront cost", desc: "No membership fee. Just 5% per transaction — paid by the customer, not you." },
              { title: "No app needed", desc: "Customers just scan and pay. No download, no signup — under 30 seconds." },
              { title: "Professional dashboard", desc: "Real-time stats, revenue charts, customer feedback and financial management — all in one panel." },
              { title: "Secure & transparent", desc: "Payments go through Zarinpal's secure gateway. Fees are fully transparent and shown before payment." },
              { title: "Custom QR code", desc: "Each café gets its own unique QR code. Download it, print it, and place it on tables." },
              { title: "Customer ratings & reviews", desc: "Customers leave ratings and comments — feedback that truly helps you improve." },
            ] : [
              { title: "بدون هزینه اولیه", desc: "بدون هزینه عضویت. تنها ۵٪ کارمزد روی هر تراکنش — اون هم از مشتری، نه از شما." },
              { title: "مشتری چیزی نصب نمی‌کنه", desc: "مشتری فقط اسکن می‌کنه و پرداخت می‌کنه. بدون دانلود، بدون ثبت‌نام — زیر ۳۰ ثانیه." },
              { title: "داشبورد حرفه‌ای", desc: "آمار لحظه‌ای، نمودار درآمد، بازخورد مشتری‌ها و مدیریت مالی — همه در یه پنل." },
              { title: "امن و شفاف", desc: "پرداخت از درگاه امن زرین‌پال انجام می‌شه. کارمزد کاملاً شفاف و قبل از پرداخت نمایش داده می‌شه." },
              { title: "QR کد اختصاصی", desc: "هر کافه QR کد اختصاصی خودش رو داره. دانلودش کنید، چاپش کنید و بذارید روی میزها." },
              { title: "نظرات و امتیاز مشتری", desc: "مشتری‌ها امتیاز و نظر ثبت می‌کنن — بازخوردی که واقعاً به بهتر شدن کمک می‌کنه." },
            ]).map((feature, i) => {
              const icons = [
                <svg key="0" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
                <svg key="1" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
                <svg key="2" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
                <svg key="3" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
                <svg key="4" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /></svg>,
                <svg key="5" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>,
              ];
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-card-sm flex items-start gap-4 card-hover border border-gray-100"
                >
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    {icons[i]}
                  </div>
                  <div>
                    <h3 className="font-extrabold mb-1.5 text-dark">{feature.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ Pricing ══════════ */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-3">{t("pricing.title")}</h2>
          <p className="text-muted mb-10">{t("pricing.subtitle")}</p>
          <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100">
            <div className="text-5xl font-extrabold text-cta mb-2">
              {isEn ? "5" : "۵"}<span className="text-2xl">%</span>
            </div>
            <p className="text-muted mb-6">{t("pricing.fee")}</p>
            <hr className="my-6 border-gray-100" />
            <ul className={`${isEn ? "text-left" : "text-right"} space-y-3 text-muted text-sm`}>
              {(isEn ? [
                "Free registration for all cafés",
                "Free withdrawals over 500,000 Toman",
                "Custom printable QR code",
                "Full management dashboard with charts",
                "CSV export of transactions",
              ] : [
                "ثبت‌نام رایگان برای همه کافه‌ها",
                "برداشت رایگان بالای ۵۰۰,۰۰۰ تومان",
                "QR کد اختصاصی قابل چاپ",
                "داشبورد مدیریت کامل با نمودار",
                "خروجی CSV از تراکنش‌ها",
              ]).map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">{t("faq.title")}</h2>
          <div className="space-y-4">
            {(isEn ? [
              { q: "Does the customer need to install an app?", a: "No. The customer just scans the QR code with their phone camera and the payment page opens in the browser. No app installation needed." },
              { q: "When does the tip reach my account?", a: "Tips are immediately added to your EasyTip wallet. Withdrawals to your bank account are typically processed within 72 business hours." },
              { q: "Who pays the 5% fee?", a: "The customer pays the fee, not the café. For example, if the customer tips 100,000 Toman, 5,000 Toman fee is added and the customer pays 105,000 Toman. You receive the full 100,000 Toman." },
              { q: "What if a customer pays by mistake?", a: "Submit a support ticket through the dashboard and we'll review it. If confirmed, the amount can be refunded." },
              { q: "Are there any monthly or annual fees?", a: "No. EasyTip is completely free. The only cost is the 5% per-transaction fee paid by the customer." },
            ] : [
              { q: "مشتری نیاز به نصب اپلیکیشن داره؟", a: "خیر. مشتری فقط QR کد رو با دوربین گوشی اسکن می‌کنه و صفحه پرداخت در مرورگر باز می‌شه. نیازی به نصب هیچ اپلیکیشنی نیست." },
              { q: "پول انعام کِی به حسابم واریز می‌شه؟", a: "انعام بلافاصله به کیف‌پول شما در پنل ایزی‌تیپ اضافه می‌شه. برداشت به حساب بانکی معمولاً تا ۷۲ ساعت کاری پردازش می‌شه." },
              { q: "کارمزد ۵٪ از کی گرفته می‌شه؟", a: "کارمزد از مشتری گرفته می‌شه، نه از کافه. مثلاً اگه مشتری ۱۰۰ هزار تومان انعام بده، ۵ هزار تومان کارمزد روش اضافه می‌شه و مشتری ۱۰۵ هزار تومان پرداخت می‌کنه. کل ۱۰۰ هزار تومان به شما می‌رسه." },
              { q: "اگه مشتری اشتباهی پرداخت کنه چی؟", a: "از طریق بخش پشتیبانی در داشبورد تیکت بزنید تا بررسی کنیم. در صورت تایید، مبلغ قابل بازگشته." },
              { q: "آیا هزینه ماهانه یا سالانه دارید؟", a: "خیر. ایزی‌تیپ کاملاً رایگانه. تنها هزینه همون ۵٪ کارمزد هر تراکنشه که مشتری پرداخت می‌کنه." },
            ]).map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-card-sm group"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-bold text-dark hover:text-primary transition-colors">
                  {faq.q}
                  <svg className="w-5 h-5 text-muted flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-white to-secondary text-center">
        <h2 className="text-3xl font-extrabold mb-3">{t("cta.title")}</h2>
        <p className="text-muted mb-8 max-w-md mx-auto">{t("cta.subtitle")}</p>
        <Link
          href="/auth/register"
          className="inline-block bg-cta text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-cta-hover transition-all shadow-lg shadow-cta/20 hover:shadow-xl btn-press"
        >
          {t("cta.button")}
        </Link>
      </section>

      {/* ══════════ Footer ══════════ */}
      <footer className="bg-dark text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl font-extrabold mb-1">
            {isEn ? (
              <>Easy<span className="text-primary">Tip</span></>
            ) : (
              <>ایزی‌<span className="text-primary">تیپ</span></>
            )}
          </p>
          <p className="text-gray-400 text-sm">{t("footer.desc")}</p>

          {/* Contact Us (toggle) */}
          <FooterContact />

          {/* Links */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <Link href="/terms" className="text-gray-400 text-xs hover:text-primary transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="text-gray-400 text-xs hover:text-primary transition-colors">
              {t("footer.privacy")}
            </Link>
          </div>
          <hr className="my-6 border-gray-700" />
          <p className="text-gray-500 text-xs">{t("footer.copy")}</p>
        </div>
      </footer>
    </main>
  );
}
