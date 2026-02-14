import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-dark mb-3">۴۰۴</h1>
        <h2 className="text-xl font-bold text-dark mb-3">
          اینجا چیزی پیدا نشد
        </h2>
        <p className="text-muted mb-8 leading-relaxed text-sm">
          صفحه‌ای که دنبالش هستید وجود نداره یا جابجا شده.
        </p>
        <Link
          href="/"
          className="inline-block bg-cta text-white px-8 py-3 rounded-2xl font-bold hover:bg-cta-hover transition-all btn-press shadow-sm"
        >
          برگشت به خانه
        </Link>
      </div>
    </main>
  );
}
