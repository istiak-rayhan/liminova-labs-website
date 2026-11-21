const UK = "Europe/London";
const ET = "America/New_York";
const NOTICE_MS = 2 * 60 * 60 * 1000;
const CALL_MS = 30 * 60 * 1000;

/** Local start times on a client weekday. UK covers Europe morning through dinner. ET covers US morning through dinner. */
const WAVES: { zone: string; starts: string[] }[] = [
  { zone: UK, starts: ["09:00", "12:30"] },
  { zone: ET, starts: ["09:30", "13:00", "16:30", "19:30"] },
];

export type Slot = {
  id: string;
  day: string;
  time: string;
  uk: string;
  label: string;
  start: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function part(date: Date, timeZone: string, type: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  return parts.find((item) => item.type === type)?.value ?? "";
}

function zoneOffsetMs(date: Date, timeZone: string) {
  const year = Number(part(date, timeZone, "year"));
  const month = Number(part(date, timeZone, "month"));
  const day = Number(part(date, timeZone, "day"));
  let hour = Number(part(date, timeZone, "hour"));
  const minute = Number(part(date, timeZone, "minute"));
  const second = Number(part(date, timeZone, "second"));
  if (hour === 24) hour = 0;
  const asUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  return asUtc - date.getTime();
}

function zonedTime(ymd: string, hm: string, timeZone: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  const [hour, minute] = hm.split(":").map(Number);
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const corrected = new Date(guess.getTime() - zoneOffsetMs(guess, timeZone));
  return new Date(guess.getTime() - zoneOffsetMs(corrected, timeZone));
}

function ymdInZone(date: Date, timeZone: string) {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return formatted;
}

function addDays(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`;
}

function weekday(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(date);
}

function isWeekday(ymd: string, timeZone: string) {
  const day = weekday(zonedTime(ymd, "12:00", timeZone), timeZone);
  return day !== "Sat" && day !== "Sun";
}

function dayLabel(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(date);
}

function dayKey(date: Date, timeZone: string) {
  return ymdInZone(date, timeZone);
}

function clock(date: Date, timeZone: string) {
  const end = new Date(date.getTime() + CALL_MS);
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  });
  return `${format.format(date)}–${format.format(end)}`;
}

function buildSlot(start: Date): Slot {
  const etDay = dayLabel(start, ET);
  const ukClock = clock(start, UK);
  const uk =
    dayKey(start, UK) === dayKey(start, ET) ? `${ukClock} UK` : `${ukClock} UK, ${dayLabel(start, UK)}`;
  const time = `${clock(start, ET)} ET`;
  return {
    id: start.toISOString(),
    day: etDay,
    time,
    uk,
    label: `${etDay}, ${time} · ${uk}`,
    start: start.toISOString(),
  };
}

export function upcomingSlots(now = new Date(), days = 6): Slot[] {
  const slots: Slot[] = [];
  let cursor = ymdInZone(now, ET);
  let seen = 0;
  let guard = 0;

  while (seen < days && guard < 24) {
    guard += 1;
    const open = new Map<string, Slot>();
    for (const wave of WAVES) {
      if (!isWeekday(cursor, wave.zone)) continue;
      for (const hm of wave.starts) {
        const start = zonedTime(cursor, hm, wave.zone);
        if (start.getTime() < now.getTime() + NOTICE_MS) continue;
        if (weekday(start, wave.zone) === "Sat" || weekday(start, wave.zone) === "Sun") continue;
        const slot = buildSlot(start);
        open.set(slot.id, slot);
      }
    }
    if (WAVES.some((wave) => isWeekday(cursor, wave.zone))) seen += 1;
    slots.push(...open.values());
    cursor = addDays(cursor, 1);
  }

  return slots.sort((a, b) => a.start.localeCompare(b.start));
}

export function findSlot(id: string, now = new Date()) {
  return upcomingSlots(now).find((slot) => slot.id === id) ?? null;
}

export const clientZones = [
  { id: "America/New_York", label: "US Eastern" },
  { id: "America/Chicago", label: "US Central" },
  { id: "America/Denver", label: "US Mountain" },
  { id: "America/Los_Angeles", label: "US Pacific" },
  { id: "Europe/London", label: "United Kingdom" },
  { id: "Europe/Berlin", label: "Central Europe" },
  { id: "Asia/Dhaka", label: "Bangladesh" },
] as const;

export const defaultClientZone = "America/New_York";

export function slotDateKey(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function slotDateLabel(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function slotClock(iso: string, timeZone: string) {
  const start = new Date(iso);
  const end = new Date(start.getTime() + CALL_MS);
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  });
  return `${format.format(start)}–${format.format(end)}`;
}
