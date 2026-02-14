"use client";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-dark mb-3">خطا در بارگذاری</h2>
      <p className="text-gray-500 text-sm mb-6">
        مشکلی در بارگذاری این صفحه رخ داده. لطفاً دوباره تلاش کنید.
      </p>
      <button
        onClick={reset}
        className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-green-600 transition-all"
      >
        تلاش دوباره
      </button>
    </div>
  );
}
