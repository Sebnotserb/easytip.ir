"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  _count: { replies: number };
}

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "باز", color: "bg-yellow-50 text-yellow-600" },
  IN_PROGRESS: { label: "در حال بررسی", color: "bg-blue-50 text-blue-600" },
  CLOSED: { label: "بسته شده", color: "bg-gray-100 text-gray-500" },
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchTickets = () => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then((data) => setTickets(data.tickets || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا");
        return;
      }

      setSubject("");
      setMessage("");
      setShowForm(false);
      fetchTickets();
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat("fa-IR").format(new Date(d));

  if (loading) {
    return (
      <div className="animate-pulse py-20 text-center text-gray-400">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">تیکت‌های پشتیبانی</h1>
          <p className="text-gray-500 text-sm mt-1">
            مشکل یا سؤالی دارید؟ تیکت ثبت کنید.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-cta text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-green-600 transition-all"
        >
          {showForm ? "بستن" : "تیکت جدید +"}
        </button>
      </div>

      {/* New ticket form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-8"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-bold text-dark mb-2">
              عنوان
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              maxLength={200}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
              placeholder="مثلاً: مشکل در برداشت وجه"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-dark mb-2">
              توضیحات
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={2000}
              rows={4}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all resize-none"
              placeholder="مشکل خود را با جزئیات توضیح دهید..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-cta text-white px-6 py-2 rounded-xl font-bold hover:bg-green-600 transition-all disabled:bg-gray-300"
          >
            {submitting ? "در حال ارسال..." : "ارسال تیکت"}
          </button>
        </form>
      )}

      {/* Tickets list */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-card-sm">
          <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796l-3.448 4.138m0 0a3.765 3.765 0 00-2.528 0m2.528 0l-4.138 3.448M7.288 19.67a9.014 9.014 0 010-9.424m4.138 5.976a3.736 3.736 0 01-.88 1.388 3.737 3.737 0 01-1.388.88m2.268-2.268l-4.138 3.448m0 0a9.027 9.027 0 01-1.306-1.652M4.33 16.712l4.138-3.448m-4.138 3.448a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0L4.33 7.288m0 0A9.027 9.027 0 015.636 5.636L4.33 7.288z" />
          </svg>
          <p className="text-muted text-sm font-bold mb-1">هنوز تیکتی ثبت نکردید</p>
          <p className="text-gray-400 text-xs">مشکل یا سؤالی دارید؟ تیکت بزنید تا سریع پاسخ بدیم</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const st = statusMap[ticket.status] || statusMap.OPEN;
            return (
              <Link
                key={ticket.id}
                href={`/dashboard/tickets/${ticket.id}`}
                className="block bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-dark truncate">
                      {ticket.subject}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{formatDate(ticket.createdAt)}</span>
                      <span>{ticket._count.replies} پاسخ</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${st.color}`}
                  >
                    {st.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
