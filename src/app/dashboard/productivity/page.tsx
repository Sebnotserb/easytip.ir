"use client";

import { useEffect, useMemo, useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  earnedXp: boolean;
}

interface ProductivityState {
  date: string;
  tasks: Task[];
  streak: number;
  xp: number;
  totalCompleted: number;
  lastActiveDate?: string;
  sessionMinutesToday: number;
}

const MOTIVATIONS = [
  "پیوستگی از انگیزه مهم‌تره. فقط امروز رو ببر!",
  "هر تسک انجام‌شده = یک قدم نزدیک‌تر به رشد EasyTip",
  "تو داری چیزی می‌سازی که واقعاً به آدم‌ها کمک می‌کنه 💚",
  "امروز کوچیک شروع کن، فردا بزرگ نتیجه بگیر.",
];

export default function ProductivityPage() {
  const [state, setState] = useState<ProductivityState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  const fetchState = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/productivity");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در دریافت اطلاعات");
      setState(data.state);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const completed = useMemo(
    () => state?.tasks.filter((t) => t.completed).length || 0,
    [state]
  );
  const total = state?.tasks.length || 0;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const motivation = MOTIVATIONS[(state?.streak || 0) % MOTIVATIONS.length];

  const mutate = async (payload: Record<string, unknown>) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/productivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ذخیره اطلاعات");
      setState(data.state);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در ذخیره اطلاعات");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">در حال بارگذاری چک‌لیست روزانه...</div>
    );
  }

  if (!state) {
    return (
      <div className="py-20 text-center text-red-500">مشکلی در دریافت اطلاعات پیش آمد.</div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark">برنامه رشد روزانه</h1>
        <p className="text-sm text-muted mt-1">چک‌لیست، استریک و انگیزه روزانه برای رشد EasyTip</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="استریک" value={`${state.streak.toLocaleString("fa-IR")} روز`} icon="🔥" />
        <StatCard title="امتیاز (XP)" value={state.xp.toLocaleString("fa-IR")} icon="⭐" />
        <StatCard title="پیشرفت امروز" value={`${progress.toLocaleString("fa-IR")}٪`} icon="📈" />
        <StatCard
          title="زمان مفید امروز"
          value={`${state.sessionMinutesToday.toLocaleString("fa-IR")} دقیقه`}
          icon="⏱️"
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-5 mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-extrabold text-dark">هدف امروز</h2>
          <span className="text-xs text-gray-500">
            {completed.toLocaleString("fa-IR")} از {total.toLocaleString("fa-IR")} انجام شده
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-cta transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-card p-5">
          <h2 className="font-extrabold text-dark mb-4">چک‌لیست روزانه</h2>
          <div className="space-y-2 mb-4">
            {state.tasks.length === 0 ? (
              <p className="text-sm text-gray-400">هنوز تسکی اضافه نشده.</p>
            ) : (
              state.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    disabled={busy}
                    onChange={(e) =>
                      mutate({
                        action: "toggleTask",
                        taskId: task.id,
                        checked: e.target.checked,
                      })
                    }
                    className="h-5 w-5 rounded border-gray-300 text-cta focus:ring-cta"
                  />
                  <p
                    className={`flex-1 text-sm ${
                      task.completed ? "line-through text-gray-400" : "text-dark"
                    }`}
                  >
                    {task.title}
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      mutate({
                        action: "deleteTask",
                        taskId: task.id,
                      })
                    }
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const title = newTask.trim();
              if (!title || busy) return;
              mutate({ action: "addTask", title });
              setNewTask("");
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="مثال: تماس با ۳ لید گرم امروز"
              className="flex-1 rounded-xl border-2 border-gray-200 p-3 text-sm focus:border-primary transition-all"
              maxLength={120}
            />
            <button
              type="submit"
              disabled={busy || !newTask.trim()}
              className="rounded-xl bg-dark text-white px-5 py-3 text-sm font-bold hover:bg-slate-800 disabled:bg-gray-300 transition-colors"
            >
              افزودن تسک
            </button>
          </form>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
            <h3 className="font-extrabold text-dark mb-2">انگیزه امروز</h3>
            <p className="text-sm text-muted leading-relaxed">{motivation}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
            <h3 className="font-extrabold text-dark mb-3">ثبت زمان کار</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => mutate({ action: "addSessionMinutes", minutes: 15 })}
                className="rounded-xl bg-secondary text-dark py-2.5 text-sm font-bold hover:bg-primary/30 transition-colors"
              >
                +۱۵ دقیقه
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => mutate({ action: "addSessionMinutes", minutes: 30 })}
                className="rounded-xl bg-secondary text-dark py-2.5 text-sm font-bold hover:bg-primary/30 transition-colors"
              >
                +۳۰ دقیقه
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              هر روز حداقل ۹۰ دقیقه برای رشد پروژه وقت بگذار.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-xl font-extrabold text-dark">{value}</p>
    </div>
  );
}

