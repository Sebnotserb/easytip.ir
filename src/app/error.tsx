"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-dark mb-4">
          مشکلی پیش آمده!
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          متأسفانه خطایی در بارگذاری صفحه رخ داده.
          <br />
          لطفاً دوباره تلاش کنید.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-cta text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-600 transition-all"
        >
          تلاش دوباره
        </button>
      </div>
    </main>
  );
}
