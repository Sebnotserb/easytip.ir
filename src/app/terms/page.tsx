import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شرایط استفاده",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-dark mb-8">شرایط استفاده از خدمات</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۱. مقدمه</h2>
            <p>
              ایزی‌تیپ یک پلتفرم انعام دیجیتال است که امکان پرداخت انعام آنلاین
              به کافه‌ها و رستوران‌ها را از طریق اسکن QR کد فراهم می‌کند. با
              استفاده از این سرویس، شما شرایط زیر را می‌پذیرید.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۲. ثبت‌نام و حساب کاربری</h2>
            <p>
              برای ثبت‌نام به‌عنوان صاحب کافه، ارائه اطلاعات صحیح و معتبر الزامی
              است. مسئولیت حفظ امنیت حساب کاربری و رمز عبور بر عهده کاربر است.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۳. نحوه کارکرد سرویس</h2>
            <p>
              مشتریان با اسکن QR کد کافه، مبلغ انعام مورد نظر خود را از طریق
              درگاه بانکی پرداخت می‌کنند. مبلغ انعام پس از کسر کارمزد پلتفرم
              (۵٪) به کیف‌پول کافه واریز می‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۴. کارمزد و هزینه‌ها</h2>
            <ul className="list-inside space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                کارمزد خدمات: ۵٪ از مبلغ انعام (از مشتری دریافت می‌شود)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                برداشت بالای ۵۰۰,۰۰۰ تومان: رایگان
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                برداشت زیر ۵۰۰,۰۰۰ تومان: ۱۰٪ کارمزد
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۵. برداشت وجه</h2>
            <p>
              صاحبان کافه می‌توانند موجودی کیف‌پول خود را با ثبت درخواست برداشت
              به حساب بانکی خود انتقال دهند. بررسی و پردازش درخواست‌ها تا ۷۲
              ساعت کاری زمان می‌برد.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۶. محدودیت‌ها</h2>
            <ul className="list-inside space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                حداقل مبلغ انعام: ۱,۰۰۰ تومان
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                حداکثر مبلغ انعام: ۵,۰۰۰,۰۰۰ تومان
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                حداقل مبلغ برداشت: ۱۰,۰۰۰ تومان
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۷. مسئولیت‌ها</h2>
            <p>
              ایزی‌تیپ صرفاً واسطه پرداخت انعام است و مسئولیتی در قبال کیفیت
              خدمات کافه‌ها ندارد. هرگونه اختلاف بین مشتری و کافه خارج از حوزه
              مسئولیت پلتفرم است.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">۸. تغییرات</h2>
            <p>
              ایزی‌تیپ حق تغییر شرایط استفاده را در هر زمان برای خود محفوظ
              می‌دارد. تغییرات از طریق سایت اطلاع‌رسانی خواهد شد.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
