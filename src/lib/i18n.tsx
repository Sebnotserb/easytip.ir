"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Locale = "fa" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const I18nContext = createContext<I18nContextType>({
  locale: "fa",
  setLocale: () => {},
  t: (key: string) => key,
  dir: "rtl",
});

// ─── Translation dictionaries ─────────────────────

const translations: Record<Locale, Record<string, string>> = {
  fa: {
    // ── Header / Nav ──
    "nav.login": "ورود",
    "nav.register": "ثبت‌نام رایگان",
    "nav.brand": "ایزی‌تیپ",

    // ── Landing: Hero ──
    "hero.badge": "برای همه کافه‌ها رایگانه",
    "hero.title1": "دریافت انعام رو",
    "hero.title2": "آسون",
    "hero.title3": "کنید.",
    "hero.subtitle": "یه راه‌حل مدرن و مبتنی بر QR کد که مشتری‌ها بدون دردسر قدردانی‌شون رو نشون بدن — و شما تا ۸۰٪ رشد در دریافت انعام رو از همون لحظه تجربه کنید.",
    "hero.cta": "حساب رایگان بسازید",
    "hero.demo": "مشاهده دمو",
    "hero.secondary": "چطور کار می‌کنه؟",

    // ── Landing: Social Proof ──
    "proof.fee": "۵٪",
    "proof.feeLabel": "تنها کارمزد",
    "proof.time": "۳۰ ثانیه",
    "proof.timeLabel": "از اسکن تا پرداخت",
    "proof.noApp": "بدون اپ",
    "proof.noAppLabel": "بدون ثبت‌نام مشتری",
    "proof.free": "رایگان",
    "proof.freeLabel": "بدون هزینه ماهانه",

    // ── Landing: How It Works ──
    "how.title": "فراتر از یه انعام ساده",
    "how.subtitle": "یه تجربه مدرن که مشتری‌ها راحت قدردانی کنن و بازخوردشون رو به اشتراک بذارن.\nوقتی ۷ نفر از هر ۱۰ نفر پول نقد همراهشون ندارن — وقتشه یه قدم جلوتر باشید.",
    "how.step": "مرحله",
    "how.step1.title": "اسکن QR کد",
    "how.step1.desc": "مشتری دوربین گوشی رو روی QR کد میز می‌گیره — بدون نصب اپ، بدون ثبت‌نام.",
    "how.step2.title": "انتخاب مبلغ",
    "how.step2.desc": "مبلغ دلخواه رو انتخاب می‌کنه و اگه بخواد، نظر و امتیاز هم ثبت می‌کنه.",
    "how.step3.title": "پرداخت امن",
    "how.step3.desc": "پرداخت از درگاه امن زرین‌پال انجام می‌شه و مبلغ مستقیم به کیف‌پول کافه می‌رسه.",

    // ── Landing: Features ──
    "features.title": "با ایزی‌تیپ یه سطح بالاتر برید",
    "features.subtitle": "ابزارهایی که مدیریت انعام رو حرفه‌ای و لذت‌بخش می‌کنن",

    // ── Landing: Pricing ──
    "pricing.title": "ایزی‌تیپ برای همه رایگانه",
    "pricing.subtitle": "هیچ هزینه پنهانی وجود نداره — مدل درآمدی ما ساده و شفافه",
    "pricing.fee": "کارمزد خدمات (از مشتری — نه از کافه)",

    // ── Landing: FAQ ──
    "faq.title": "همه سؤالاتتون، یه‌جا جواب داده شده",

    // ── Landing: CTA ──
    "cta.title": "وقتشه انعام دیجیتال رو شروع کنید",
    "cta.subtitle": "ثبت‌نام رایگانه، راه‌اندازی ۲ دقیقه‌ایه و از همون روز اول نتیجه‌شو می‌بینید",
    "cta.button": "همین الان شروع کنید",

    // ── Landing: Footer ──
    "footer.desc": "پلتفرم انعام دیجیتال برای کافه‌ها و رستوران‌ها",
    "footer.terms": "شرایط استفاده",
    "footer.privacy": "حریم خصوصی",
    "footer.copy": "© ۱۴۰۴ ایزی‌تیپ — تمامی حقوق محفوظ است",

    // ── Login ──
    "login.title": "ایزی‌تیپ",
    "login.subtitle": "خوش اومدید — وارد پنل مدیریت بشید",
    "login.email": "ایمیل",
    "login.password": "رمز عبور",
    "login.forgot": "فراموش کردید؟",
    "login.submit": "ورود به پنل",
    "login.loading": "در حال ورود...",
    "login.noAccount": "هنوز ثبت‌نام نکردید؟",
    "login.register": "ثبت‌نام رایگان",
    "login.errorDefault": "ایمیل یا رمز عبور اشتباهه",
    "login.errorNetwork": "اتصال برقرار نشد — لطفاً اینترنت‌تون رو چک کنید",

    // ── Register ──
    "register.title": "ایزی‌تیپ",
    "register.subtitle": "در کمتر از ۲ دقیقه حسابتون رو بسازید",
    "register.personalInfo": "اطلاعات شخصی",
    "register.name": "نام و نام‌خانوادگی",
    "register.namePlaceholder": "مثلاً: علی محمدی",
    "register.email": "ایمیل",
    "register.phone": "موبایل",
    "register.phoneOptional": "(اختیاری)",
    "register.phonePlaceholder": "۰۹۱۲۳۴۵۶۷۸۹",
    "register.password": "رمز عبور",
    "register.passwordPlaceholder": "حداقل ۶ کاراکتر",
    "register.cafeInfo": "اطلاعات کافه",
    "register.cafeName": "نام کافه / رستوران",
    "register.cafeNamePlaceholder": "مثلاً: کافه لمیز",
    "register.submit": "ساخت حساب رایگان",
    "register.loading": "در حال ثبت‌نام...",
    "register.hasAccount": "قبلاً ثبت‌نام کردید؟",
    "register.login": "ورود",
    "register.errorPhone": "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع بشه",
    "register.errorPassword": "رمز عبور حداقل ۶ کاراکتر باشه",
    "register.errorDefault": "مشکلی پیش اومد — لطفاً دوباره امتحان کنید",
    "register.errorNetwork": "اتصال برقرار نشد — لطفاً اینترنت‌تون رو چک کنید",

    // ── Forgot Password ──
    "forgot.title": "ایزی‌تیپ",
    "forgot.subtitle": "بازیابی رمز عبور",
    "forgot.desc": "ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود.",
    "forgot.email": "ایمیل",
    "forgot.submit": "ارسال لینک بازیابی",
    "forgot.loading": "در حال ارسال...",
    "forgot.remember": "رمز خود را به یاد آوردید؟",
    "forgot.login": "ورود",
    "forgot.sentTitle": "ایمیل بازیابی ارسال شد",
    "forgot.sentDesc": "اگر ایمیل شما در سیستم ثبت باشد، لینک بازیابی رمز عبور به آن ارسال خواهد شد.",
    "forgot.backToLogin": "بازگشت به صفحه ورود",

    // ── Reset Password ──
    "reset.title": "ایزی‌تیپ",
    "reset.subtitle": "تنظیم رمز عبور جدید",
    "reset.newPassword": "رمز عبور جدید",
    "reset.confirmPassword": "تکرار رمز عبور",
    "reset.submit": "ذخیره رمز عبور جدید",
    "reset.loading": "در حال ذخیره...",
    "reset.successTitle": "رمز عبور تغییر کرد",
    "reset.successDesc": "رمز عبور شما با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید.",
    "reset.loginButton": "ورود به حساب",
    "reset.invalidTitle": "لینک نامعتبر",
    "reset.invalidDesc": "لینک بازیابی رمز عبور نامعتبر یا منقضی شده است.",
    "reset.newLink": "درخواست لینک جدید",

    // ── Tip Page ──
    "tip.selectAmount": "مبلغ انعام رو انتخاب کنید",
    "tip.customPlaceholder": "یا مبلغ دلخواه وارد کنید...",
    "tip.tipAmount": "مبلغ انعام",
    "tip.serviceFee": "کارمزد سرویس (۵٪)",
    "tip.total": "جمع کل",
    "tip.toman": "تومان",
    "tip.payButton": "پرداخت انعام",
    "tip.paying": "در حال اتصال به درگاه...",
    "tip.securePayment": "پرداخت امن از طریق درگاه زرین‌پال",
    "tip.rateOptional": "امتیاز و نظر بدید (اختیاری)",
    "tip.howWas": "تجربه‌تون چطور بود؟",
    "tip.namePlaceholder": "اسمتون (اختیاری)",
    "tip.commentPlaceholder": "یه نظر یا پیشنهاد دارید؟ (اختیاری)",
    "tip.followOn": "را در اینستاگرام دنبال کنید",
    "tip.defaultMessage": "خوشحال می‌شیم حمایتمون کنید 💚",
    "tip.errorDefault": "مشکلی پیش اومد — لطفاً دوباره امتحان کنید",
    "tip.errorNetwork": "اتصال برقرار نشد — لطفاً اینترنت‌تون رو چک کنید",

    // ── Thank You ──
    "thanks.checking": "در حال بررسی پرداخت...",
    "thanks.successTitle": "ممنون از لطف و مهربونی شما",
    "thanks.successSubtitle": "حمایت‌تون به تیم کافه رسید و کلی انرژی بهشون داد",
    "thanks.paymentSuccess": "پرداخت موفق",
    "thanks.amountPaid": "مبلغ پرداختی",
    "thanks.status": "وضعیت",
    "thanks.confirmed": "تایید شده ✓",
    "thanks.paymentMethod": "روش پرداخت",
    "thanks.zarinpal": "درگاه زرین‌پال",
    "thanks.receiptNote": "رسید پرداخت در تاریخچه بانک شما ثبت شده است",
    "thanks.backHome": "بازگشت به صفحه اصلی ←",
    "thanks.failTitle": "پرداخت ناموفق",
    "thanks.failSubtitle": "نگران نباشید — مبلغی از حساب شما کسر نشده.",
    "thanks.failRetry": "می‌تونید دوباره امتحان کنید.",
    "thanks.failReasons": "دلایل احتمالی:",
    "thanks.failReason1": "لغو توسط کاربر",
    "thanks.failReason2": "اختلال در اتصال اینترنت",
    "thanks.failReason3": "مشکل موقت درگاه بانکی",
    "thanks.retry": "تلاش دوباره",
    "thanks.backHomeSimple": "بازگشت به صفحه اصلی",

    // ── 404 ──
    "notFound.title": "اینجا چیزی پیدا نشد",
    "notFound.desc": "صفحه‌ای که دنبالش می‌گردید وجود نداره یا منتقل شده.",
    "notFound.back": "بازگشت به صفحه اصلی",
  },

  en: {
    // ── Header / Nav ──
    "nav.login": "Login",
    "nav.register": "Sign Up Free",
    "nav.brand": "EasyTip",

    // ── Landing: Hero ──
    "hero.badge": "Free for all cafés",
    "hero.title1": "Make tipping",
    "hero.title2": "effortless",
    "hero.title3": ".",
    "hero.subtitle": "A modern, QR-based solution for customers to show their appreciation effortlessly — and watch your tips grow by up to 80% from day one.",
    "hero.cta": "Create Free Account",
    "hero.demo": "Try Demo",
    "hero.secondary": "How does it work?",

    // ── Landing: Social Proof ──
    "proof.fee": "5%",
    "proof.feeLabel": "The only fee",
    "proof.time": "30 sec",
    "proof.timeLabel": "From scan to payment",
    "proof.noApp": "No app",
    "proof.noAppLabel": "No customer signup",
    "proof.free": "Free",
    "proof.freeLabel": "No monthly fees",

    // ── Landing: How It Works ──
    "how.title": "More than just a tip",
    "how.subtitle": "A modern experience that lets customers easily show appreciation and share feedback.\nWhen 7 out of 10 people don't carry cash — it's time to stay one step ahead.",
    "how.step": "Step",
    "how.step1.title": "Scan QR Code",
    "how.step1.desc": "Customer points their phone camera at the QR code on the table — no app, no signup.",
    "how.step2.title": "Choose Amount",
    "how.step2.desc": "They pick their desired amount, and optionally leave a rating and comment.",
    "how.step3.title": "Secure Payment",
    "how.step3.desc": "Payment goes through Zarinpal's secure gateway — directly to the café's wallet.",

    // ── Landing: Features ──
    "features.title": "Level up with EasyTip",
    "features.subtitle": "Tools that make tip management professional and enjoyable",

    // ── Landing: Pricing ──
    "pricing.title": "EasyTip is free for everyone",
    "pricing.subtitle": "No hidden fees — our revenue model is simple and transparent",
    "pricing.fee": "Service fee (from customer — not from café)",

    // ── Landing: FAQ ──
    "faq.title": "All your questions, answered in one place",

    // ── Landing: CTA ──
    "cta.title": "Time to go digital with tips",
    "cta.subtitle": "Free signup, 2-minute setup, and you'll see results from day one",
    "cta.button": "Get Started Now",

    // ── Landing: Footer ──
    "footer.desc": "Digital tipping platform for cafés and restaurants",
    "footer.terms": "Terms of Use",
    "footer.privacy": "Privacy Policy",
    "footer.copy": "© 2026 EasyTip — All rights reserved",

    // ── Login ──
    "login.title": "EasyTip",
    "login.subtitle": "Welcome — log in to your dashboard",
    "login.email": "Email",
    "login.password": "Password",
    "login.forgot": "Forgot?",
    "login.submit": "Log In",
    "login.loading": "Logging in...",
    "login.noAccount": "Don't have an account?",
    "login.register": "Sign Up Free",
    "login.errorDefault": "Incorrect email or password",
    "login.errorNetwork": "Connection failed — please check your internet",

    // ── Register ──
    "register.title": "EasyTip",
    "register.subtitle": "Create your account in less than 2 minutes",
    "register.personalInfo": "Personal Info",
    "register.name": "Full Name",
    "register.namePlaceholder": "e.g. John Smith",
    "register.email": "Email",
    "register.phone": "Mobile",
    "register.phoneOptional": "(optional)",
    "register.phonePlaceholder": "09123456789",
    "register.password": "Password",
    "register.passwordPlaceholder": "At least 6 characters",
    "register.cafeInfo": "Café Info",
    "register.cafeName": "Café / Restaurant Name",
    "register.cafeNamePlaceholder": "e.g. Café Lamiz",
    "register.submit": "Create Free Account",
    "register.loading": "Creating account...",
    "register.hasAccount": "Already have an account?",
    "register.login": "Log In",
    "register.errorPhone": "Mobile number must be 11 digits starting with 09",
    "register.errorPassword": "Password must be at least 6 characters",
    "register.errorDefault": "Something went wrong — please try again",
    "register.errorNetwork": "Connection failed — please check your internet",

    // ── Forgot Password ──
    "forgot.title": "EasyTip",
    "forgot.subtitle": "Reset your password",
    "forgot.desc": "Enter your email to receive a password reset link.",
    "forgot.email": "Email",
    "forgot.submit": "Send Reset Link",
    "forgot.loading": "Sending...",
    "forgot.remember": "Remember your password?",
    "forgot.login": "Log In",
    "forgot.sentTitle": "Reset Email Sent",
    "forgot.sentDesc": "If your email is registered, a password reset link has been sent to it.",
    "forgot.backToLogin": "Back to login",

    // ── Reset Password ──
    "reset.title": "EasyTip",
    "reset.subtitle": "Set a new password",
    "reset.newPassword": "New Password",
    "reset.confirmPassword": "Confirm Password",
    "reset.submit": "Save New Password",
    "reset.loading": "Saving...",
    "reset.successTitle": "Password Changed",
    "reset.successDesc": "Your password has been changed successfully. You can now log in.",
    "reset.loginButton": "Log In",
    "reset.invalidTitle": "Invalid Link",
    "reset.invalidDesc": "This password reset link is invalid or expired.",
    "reset.newLink": "Request New Link",

    // ── Tip Page ──
    "tip.selectAmount": "Select tip amount",
    "tip.customPlaceholder": "Or enter a custom amount...",
    "tip.tipAmount": "Tip amount",
    "tip.serviceFee": "Service fee (5%)",
    "tip.total": "Total",
    "tip.toman": "Toman",
    "tip.payButton": "Pay Tip",
    "tip.paying": "Connecting to payment gateway...",
    "tip.securePayment": "Secure payment via Zarinpal",
    "tip.rateOptional": "Rate & leave a comment (optional)",
    "tip.howWas": "How was your experience?",
    "tip.namePlaceholder": "Your name (optional)",
    "tip.commentPlaceholder": "Any feedback or suggestions? (optional)",
    "tip.followOn": "Follow on Instagram",
    "tip.defaultMessage": "Thank you for being here — tips are always appreciated 💚",
    "tip.errorDefault": "Something went wrong — please try again",
    "tip.errorNetwork": "Connection failed — please check your internet",

    // ── Thank You ──
    "thanks.checking": "Checking payment...",
    "thanks.successTitle": "Thank you for your kindness",
    "thanks.successSubtitle": "Your support reached the café team and truly made their day",
    "thanks.paymentSuccess": "Payment Successful",
    "thanks.amountPaid": "Amount paid",
    "thanks.status": "Status",
    "thanks.confirmed": "Confirmed ✓",
    "thanks.paymentMethod": "Payment method",
    "thanks.zarinpal": "Zarinpal Gateway",
    "thanks.receiptNote": "This payment is recorded in your bank history",
    "thanks.backHome": "→ Back to home",
    "thanks.failTitle": "Payment Failed",
    "thanks.failSubtitle": "Don't worry — nothing was charged to your account.",
    "thanks.failRetry": "You can try again.",
    "thanks.failReasons": "Possible reasons:",
    "thanks.failReason1": "Cancelled by user",
    "thanks.failReason2": "Internet connection issue",
    "thanks.failReason3": "Temporary bank gateway issue",
    "thanks.retry": "Try Again",
    "thanks.backHomeSimple": "Back to home",

    // ── 404 ──
    "notFound.title": "Page not found",
    "notFound.desc": "The page you're looking for doesn't exist or has been moved.",
    "notFound.back": "Back to home",
  },
};

// ─── Provider ─────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "fa") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    // Update document direction
    document.documentElement.dir = newLocale === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
  };

  // Set initial direction
  useEffect(() => {
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string): string => {
    return translations[locale][key] || translations.fa[key] || key;
  };

  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────

export function useI18n() {
  return useContext(I18nContext);
}
