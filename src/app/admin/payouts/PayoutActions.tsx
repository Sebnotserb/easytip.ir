"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  payoutId: string;
  currentStatus: string;
}

export default function PayoutActions({ payoutId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (newStatus: string) => {
    if (!confirm(`آیا مطمئنید؟ تغییر وضعیت به ${newStatus}`)) return;

    setLoading(newStatus);
    try {
      const res = await fetch(`/api/admin/payouts/${payoutId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در بروزرسانی");
      }
    } catch {
      alert("خطا در اتصال به سرور");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2 flex-shrink-0">
      {currentStatus === "PENDING" && (
        <>
          <button
            onClick={() => updateStatus("PROCESSING")}
            disabled={loading !== null}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {loading === "PROCESSING" ? "..." : "در حال پردازش"}
          </button>
          <button
            onClick={() => updateStatus("COMPLETED")}
            disabled={loading !== null}
            className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-all disabled:opacity-50"
          >
            {loading === "COMPLETED" ? "..." : "تایید"}
          </button>
          <button
            onClick={() => updateStatus("REJECTED")}
            disabled={loading !== null}
            className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {loading === "REJECTED" ? "..." : "رد"}
          </button>
        </>
      )}
      {currentStatus === "PROCESSING" && (
        <>
          <button
            onClick={() => updateStatus("COMPLETED")}
            disabled={loading !== null}
            className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-all disabled:opacity-50"
          >
            {loading === "COMPLETED" ? "..." : "تکمیل شد"}
          </button>
          <button
            onClick={() => updateStatus("REJECTED")}
            disabled={loading !== null}
            className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {loading === "REJECTED" ? "..." : "رد"}
          </button>
        </>
      )}
    </div>
  );
}
