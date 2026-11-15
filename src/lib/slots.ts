const ZONE = "Asia/Dhaka";
const OFFSET = "+06:00";
const STARTS = ["10:00", "11:30", "14:00", "16:00"] as const;
const NOTICE_MS = 2 * 60 * 60 * 1000;

export type Slot = {
  id: string;
  day: string;
  time: string;
  label: string;
  start: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function ymdInDhaka(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function addDays(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`;
}

function atDhaka(ymd: string, hm: string) {
  return new Date(`${ymd}T${hm}:00${OFFSET}`);
}

function weekday(date: Date) {
  return new Intl.DateTimeFormat("en-US", { timeZone: ZONE, weekday: "short" }).format(date);
}

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(date);
}

function endLabel(hm: string) {
  const [hour, minute] = hm.split(":").map(Number);
  const total = hour * 60 + minute + 30;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

export function upcomingSlots(now = new Date(), days = 6): Slot[] {
  const slots: Slot[] = [];
  let cursor = ymdInDhaka(now);
  let guard = 0;

  while (slots.length < days * STARTS.length && guard < 24) {
    guard += 1;
    const probe = atDhaka(cursor, "12:00");
    const day = weekday(probe);
    if (day !== "Sat" && day !== "Sun") {
      for (const hm of STARTS) {
        const start = atDhaka(cursor, hm);
        if (start.getTime() < now.getTime() + NOTICE_MS) continue;
        const time = `${hm}–${endLabel(hm)}`;
        slots.push({
          id: `${cursor}T${hm}${OFFSET}`,
          day: dayLabel(start),
          time,
          label: `${dayLabel(start)}, ${time} Dhaka`,
          start: start.toISOString(),
        });
      }
    }
    cursor = addDays(cursor, 1);
  }

  return slots;
}

export function findSlot(id: string, now = new Date()) {
  return upcomingSlots(now).find((slot) => slot.id === id) ?? null;
}
