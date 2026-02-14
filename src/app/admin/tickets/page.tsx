"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  _count: { replies: number };
}

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "باز", color: "bg-yellow-50 text-yellow-600" },
  IN_PROGRESS: { label: "در حال بررسی", color: "bg-blue-50 text-blue-600" },
  CLOSED: { label: "بسته شده", color: "bg-gray-100 text-gray-500" },
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then((data) => setTickets(data.tickets || []))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat("fa-IR").format(new Date(d));

  const filtered =
    filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter);

  const openCount = tickets.filter((t) => t.status === "OPEN").length;

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
            {openCount > 0
              ? `${openCount} تیکت باز`
              : "همه تیکت‌ها بررسی شده‌اند"}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "ALL", label: "همه" },
          { key: "OPEN", label: "باز" },
          { key: "IN_PROGRESS", label: "در حال بررسی" },
          { key: "CLOSED", label: "بسته شده" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === tab.key
                ? "bg-primary text-white"
                : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tickets list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          تیکتی یافت نشد
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => {
            const st = statusMap[ticket.status] || statusMap.OPEN;
            return (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="block bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-dark truncate">
                      {ticket.subject}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="font-bold text-gray-600">
                        {ticket.user.name}
                      </span>
                      <span>{ticket.user.email}</span>
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
