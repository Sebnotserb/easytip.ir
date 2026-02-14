"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Reply {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  replies: Reply[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "باز", color: "bg-yellow-50 text-yellow-600" },
  IN_PROGRESS: { label: "در حال بررسی", color: "bg-blue-50 text-blue-600" },
  CLOSED: { label: "بسته شده", color: "bg-gray-100 text-gray-500" },
};

export default function AdminTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTicket = () => {
    fetch(`/api/tickets/${ticketId}`)
      .then((r) => r.json())
      .then((data) => setTicket(data.ticket || null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      const res = await fetch(`/api/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا");
        return;
      }

      setReply("");
      fetchTicket();
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setStatusLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchTicket();
      }
    } catch {
      // silent
    } finally {
      setStatusLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d));

  if (loading) {
    return (
      <div className="animate-pulse py-20 text-center text-gray-400">
        در حال بارگذاری...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">تیکت یافت نشد</p>
        <Link href="/admin/tickets" className="text-primary font-bold hover:underline">
          بازگشت
        </Link>
      </div>
    );
  }

  const st = statusMap[ticket.status] || statusMap.OPEN;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/tickets"
          className="text-primary text-sm font-bold hover:underline"
        >
          ← بازگشت به تیکت‌ها
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-dark">{ticket.subject}</h1>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span className="font-bold text-gray-600">{ticket.user.name}</span>
            <span>{ticket.user.email}</span>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${st.color}`}>
            {st.label}
          </span>
          {ticket.status !== "CLOSED" && (
            <button
              onClick={() => updateStatus("CLOSED")}
              disabled={statusLoading}
              className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-300 transition-all disabled:opacity-50"
            >
              بستن تیکت
            </button>
          )}
          {ticket.status === "CLOSED" && (
            <button
              onClick={() => updateStatus("OPEN")}
              disabled={statusLoading}
              className="px-4 py-1.5 bg-yellow-100 text-yellow-600 rounded-xl text-xs font-bold hover:bg-yellow-200 transition-all disabled:opacity-50"
            >
              بازگشایی
            </button>
          )}
        </div>
      </div>

      {/* Original message */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">
            👤
          </span>
          <span className="text-sm font-bold text-dark">{ticket.user.name}</span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {ticket.message}
        </p>
      </div>

      {/* Replies */}
      {ticket.replies.map((r) => (
        <div
          key={r.id}
          className={`rounded-2xl p-5 mb-3 ${
            r.isAdmin
              ? "bg-primary/5 border border-primary/20"
              : "bg-white shadow-card border border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                r.isAdmin
                  ? "bg-primary/20 text-primary"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {r.isAdmin ? "🛡️" : "👤"}
            </span>
            <span className="text-sm font-bold text-dark">
              {r.isAdmin ? "پشتیبانی (شما)" : ticket.user.name}
            </span>
            <span className="text-xs text-gray-400 mr-auto">
              {formatDate(r.createdAt)}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
            {r.message}
          </p>
        </div>
      ))}

      {/* Reply form */}
      <form onSubmit={handleReply} className="mt-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          required
          rows={3}
          maxLength={2000}
          className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all resize-none mb-3"
          placeholder="پاسخ به کاربر..."
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-green-600 transition-all disabled:bg-gray-300"
        >
          {sending ? "در حال ارسال..." : "ارسال پاسخ"}
        </button>
      </form>
    </div>
  );
}
