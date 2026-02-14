"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function PrivacyContent() {
  const { locale, dir } = useI18n();
  const isEn = locale === "en";

  return (
    <main className="min-h-screen bg-white" dir={dir}>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            {isEn ? "EasyTip" : "ایزی‌تیپ"}
          </Link>
          <Link
            href="/"
            className="text-gray-500 text-sm hover:text-primary transition-colors"
          >
            {isEn ? "Back" : "بازگشت"}
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-dark mb-8">
          {isEn ? "Privacy Policy" : "سیاست حفظ حریم خصوصی"}
        </h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          {isEn ? (
            <>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">1. Information We Collect</h2>
                <p>We collect the following information:</p>
                <ul className="list-inside space-y-2 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <strong>Café owners:</strong> Name, email, mobile number (optional),
                    café name, bank details for withdrawals
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <strong>Customers:</strong> Nickname (optional), comment (optional),
                    IP address (for security)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <strong>Payment information:</strong> Processed through Zarinpal gateway
                    — we do not have access to bank card details
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">2. How We Use Information</h2>
                <ul className="list-inside space-y-2">
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Providing and improving platform services</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Processing payments and withdrawals</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Preventing fraud and abuse</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Communicating with users when necessary</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">3. Data Security</h2>
                <p>
                  We use encryption and standard security protocols to protect your
                  information. Passwords are stored encrypted, and payments are
                  processed through a secure bank gateway.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">4. Information Sharing</h2>
                <p>
                  We do not sell your personal information to any third party.
                  Information may only be shared in the following cases:
                </p>
                <ul className="list-inside space-y-2 mt-2">
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Legal obligation or judicial request</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Payment gateway (Zarinpal) for transaction processing</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">5. User Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-inside space-y-2 mt-2">
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Access your personal information</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Correct or update your information</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Request account deletion</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">6. Cookies</h2>
                <p>
                  We use essential cookies for authentication and proper site
                  functionality. These cookies include login tokens (JWT).
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">7. Contact Us</h2>
                <p>
                  For any questions about privacy, please contact us via email.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">۱. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
                <p>ما اطلاعات زیر را جمع‌آوری می‌کنیم:</p>
                <ul className="list-inside space-y-2 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <strong>صاحبان کافه:</strong> نام، ایمیل، شماره موبایل (اختیاری)، نام کافه، اطلاعات بانکی برای برداشت
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <strong>مشتریان:</strong> نام مستعار (اختیاری)، نظر (اختیاری)، آدرس IP (برای امنیت)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <strong>اطلاعات پرداخت:</strong> از طریق درگاه زرین‌پال پردازش می‌شود و ما دسترسی به اطلاعات کارت بانکی نداریم
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">۲. نحوه استفاده از اطلاعات</h2>
                <ul className="list-inside space-y-2">
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>ارائه و بهبود خدمات پلتفرم</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>پردازش پرداخت‌ها و برداشت‌ها</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>جلوگیری از تقلب و سوءاستفاده</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>ارتباط با کاربران در صورت نیاز</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">۳. امنیت اطلاعات</h2>
                <p>
                  ما از رمزنگاری و پروتکل‌های امنیتی استاندارد برای محافظت از اطلاعات شما استفاده می‌کنیم. رمزهای عبور به صورت رمزنگاری‌شده ذخیره می‌شوند و پرداخت‌ها از طریق درگاه بانکی امن انجام می‌شود.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">۴. اشتراک‌گذاری اطلاعات</h2>
                <p>
                  ما اطلاعات شخصی شما را به هیچ شخص یا شرکت ثالثی نمی‌فروشیم. اطلاعات فقط در موارد زیر ممکن است به اشتراک گذاشته شود:
                </p>
                <ul className="list-inside space-y-2 mt-2">
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>الزام قانونی یا درخواست مراجع قضایی</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>درگاه پرداخت (زرین‌پال) برای پردازش تراکنش‌ها</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">۵. حقوق کاربران</h2>
                <p>شما حق دارید:</p>
                <ul className="list-inside space-y-2 mt-2">
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>به اطلاعات شخصی خود دسترسی داشته باشید</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>اطلاعات خود را اصلاح یا بروزرسانی کنید</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>درخواست حذف حساب کاربری دهید</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">۶. کوکی‌ها</h2>
                <p>
                  ما از کوکی‌های ضروری برای احراز هویت و عملکرد صحیح سایت استفاده می‌کنیم. این کوکی‌ها شامل توکن ورود (JWT) هستند.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-dark mb-3">۷. تماس با ما</h2>
                <p>
                  در صورت هرگونه سؤال درباره حریم خصوصی، با ما از طریق ایمیل تماس بگیرید.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
