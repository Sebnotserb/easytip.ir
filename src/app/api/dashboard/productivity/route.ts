import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

interface ProductivityTask {
  id: string;
  title: string;
  completed: boolean;
  earnedXp: boolean;
}

interface ProductivityState {
  date: string;
  tasks: ProductivityTask[];
  streak: number;
  xp: number;
  totalCompleted: number;
  lastActiveDate?: string;
  sessionMinutesToday: number;
}

const DEFAULT_TASKS = [
  "بازدید حضوری از ۳ کافه",
  "دموی EasyTip برای حداقل ۱ کافه",
  "پیگیری ۵ لید قبلی",
  "تحویل یا نصب QR برای ۱ کافه",
  "ثبت گزارش کوتاه پایان روز",
];

function tehranDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value || "0000";
  const month = parts.find((p) => p.type === "month")?.value || "01";
  const day = parts.find((p) => p.type === "day")?.value || "01";
  return `${year}-${month}-${day}`;
}

function yesterdayKey(todayKey: string): string {
  const [y, m, d] = todayKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() - 1);
  return tehranDateKey(date);
}

function createDefaultState(): ProductivityState {
  return {
    date: tehranDateKey(),
    tasks: DEFAULT_TASKS.map((title, idx) => ({
      id: `default-${idx + 1}`,
      title,
      completed: false,
      earnedXp: false,
    })),
    streak: 0,
    xp: 0,
    totalCompleted: 0,
    lastActiveDate: undefined,
    sessionMinutesToday: 0,
  };
}

function normalizeForToday(state: ProductivityState): ProductivityState {
  const today = tehranDateKey();
  if (state.date === today) return state;
  return {
    ...state,
    date: today,
    tasks: state.tasks.map((task) => ({
      ...task,
      completed: false,
      earnedXp: false,
    })),
    sessionMinutesToday: 0,
  };
}

async function getOrCreateState(userId: string) {
  const latest = await prisma.auditLog.findFirst({
    where: {
      action: "PRODUCTIVITY_STATE",
      entity: "owner_productivity",
      entityId: userId,
      userId,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) {
    const initial = createDefaultState();
    const created = await prisma.auditLog.create({
      data: {
        action: "PRODUCTIVITY_STATE",
        entity: "owner_productivity",
        entityId: userId,
        userId,
        data: initial as unknown as Prisma.InputJsonValue,
      },
    });
    return { row: created, state: initial };
  }

  const raw = (latest.data || {}) as unknown as ProductivityState;
  const normalized =
    raw && Array.isArray(raw.tasks) ? normalizeForToday(raw) : createDefaultState();

  if (JSON.stringify(raw) !== JSON.stringify(normalized)) {
    const updated = await prisma.auditLog.update({
      where: { id: latest.id },
      data: { data: normalized as unknown as Prisma.InputJsonValue },
    });
    return { row: updated, state: normalized };
  }

  return { row: latest, state: normalized };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { state } = await getOrCreateState(session.userId);
  return NextResponse.json({ success: true, state });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { row, state: current } = await getOrCreateState(session.userId);
  const body = await request.json();
  const action = body?.action as string | undefined;

  let next: ProductivityState = { ...current, tasks: [...current.tasks] };
  const today = tehranDateKey();
  const yesterday = yesterdayKey(today);

  if (action === "toggleTask") {
    const taskId = String(body?.taskId || "");
    const checked = Boolean(body?.checked);
    const idx = next.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = { ...next.tasks[idx] };
    task.completed = checked;

    if (checked && !task.earnedXp) {
      task.earnedXp = true;
      next.xp += 10;
      next.totalCompleted += 1;

      if (next.lastActiveDate !== today) {
        if (next.lastActiveDate === yesterday) next.streak += 1;
        else next.streak = 1;
        next.lastActiveDate = today;
      }
    }

    next.tasks[idx] = task;
  } else if (action === "addTask") {
    const title = String(body?.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "عنوان تسک الزامی است" }, { status: 400 });
    }
    next.tasks.push({
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: title.slice(0, 120),
      completed: false,
      earnedXp: false,
    });
  } else if (action === "deleteTask") {
    const taskId = String(body?.taskId || "");
    next.tasks = next.tasks.filter((t) => t.id !== taskId);
  } else if (action === "addSessionMinutes") {
    const minutes = Math.max(0, parseInt(String(body?.minutes || "0"), 10) || 0);
    next.sessionMinutesToday += Math.min(minutes, 240);
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await prisma.auditLog.update({
    where: { id: row.id },
    data: { data: next as unknown as Prisma.InputJsonValue },
  });

  return NextResponse.json({
    success: true,
    state: (updated.data || next) as ProductivityState,
  });
}

