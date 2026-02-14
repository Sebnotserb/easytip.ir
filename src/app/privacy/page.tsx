import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حریم خصوصی",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            ایزی‌تیپ
          </Link>
          <Link
            href="/"
            className="text-gray-500 text-sm hover:text-primary transition-colors"
          >
            بازگشت
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-dark mb-8">سیاست حفظ حریم خصوصی</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۱. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
            <p>ما اطلاعات زیر را جمع‌آوری می‌کنیم:</p>
            <ul className="list-inside space-y-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <strong>صاحبان کافه:</strong> نام، ایمیل، شماره موبایل (اختیاری)،
                نام کافه، اطلاعات بانکی برای برداشت
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <strong>مشتریان:</strong> نام مستعار (اختیاری)، نظر (اختیاری)،
                آدرس IP (برای امنیت)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <strong>اطلاعات پرداخت:</strong> از طریق درگاه زرین‌پال پردازش
                می‌شود و ما دسترسی به اطلاعات کارت بانکی نداریم
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۲. نحوه استفاده از اطلاعات</h2>
            <ul className="list-inside space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                ارائه و بهبود خدمات پلتفرم
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                پردازش پرداخت‌ها و برداشت‌ها
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                جلوگیری از تقلب و سوءاستفاده
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                ارتباط با کاربران در صورت نیاز
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۳. امنیت اطلاعات</h2>
            <p>
              ما از رمزنگاری و پروتکل‌های امنیتی استاندارد برای محافظت از
              اطلاعات شما استفاده می‌کنیم. رمزهای عبور به صورت رمزنگاری‌شده
              ذخیره می‌شوند و پرداخت‌ها از طریق درگاه بانکی امن انجام می‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۴. اشتراک‌گذاری اطلاعات</h2>
            <p>
              ما اطلاعات شخصی شما را به هیچ شخص یا شرکت ثالثی نمی‌فروشیم.
              اطلاعات فقط در موارد زیر ممکن است به اشتراک گذاشته شود:
            </p>
            <ul className="list-inside space-y-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                الزام قانونی یا درخواست مراجع قضایی
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                درگاه پرداخت (زرین‌پال) برای پردازش تراکنش‌ها
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۵. حقوق کاربران</h2>
            <p>شما حق دارید:</p>
            <ul className="list-inside space-y-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                به اطلاعات شخصی خود دسترسی داشته باشید
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                اطلاعات خود را اصلاح یا بروزرسانی کنید
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                درخواست حذف حساب کاربری دهید
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۶. کوکی‌ها</h2>
            <p>
              ما از کوکی‌های ضروری برای احراز هویت و عملکرد صحیح سایت استفاده
              می‌کنیم. این کوکی‌ها شامل توکن ورود (JWT) هستند.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۷. تماس با ما</h2>
            <p>
              در صورت هرگونه سؤال درباره حریم خصوصی، با ما از طریق ایمیل تماس
              بگیرید.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
