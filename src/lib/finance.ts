import type { CmsInvestment, CmsPayout, CmsProject } from "@/lib/cms-types";

export function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function todayInDhaka(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function shiftDate(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function finalizedOf(project: CmsProject) {
  if (typeof project.finalizedValue === "number" && Number.isFinite(project.finalizedValue)) {
    return project.finalizedValue;
  }
  if (typeof project.dealValue === "number" && Number.isFinite(project.dealValue)) {
    return project.dealValue;
  }
  return 0;
}

export function receivedOf(project: CmsProject) {
  return (project.receipts ?? []).reduce(
    (sum, receipt) => sum + (Number(receipt.amount) || 0),
    0,
  );
}

export function remainingOf(project: CmsProject) {
  return Math.max(0, finalizedOf(project) - receivedOf(project));
}

export function incomeBetween(projects: CmsProject[], start: string, end: string) {
  let sum = 0;
  for (const project of projects) {
    for (const receipt of project.receipts ?? []) {
      if (receipt.date >= start && receipt.date <= end) sum += Number(receipt.amount) || 0;
    }
  }
  return sum;
}

export function memberDue(project: CmsProject, memberId: string, payouts: CmsPayout[]) {
  const share = (project.shares ?? []).find((item) => item.memberId === memberId);
  const percent = share?.percent ?? 0;
  const owed = (percent / 100) * receivedOf(project);
  const paid = payouts
    .filter((payout) => payout.projectId === project.id && payout.memberId === memberId)
    .reduce((sum, payout) => sum + (Number(payout.amount) || 0), 0);
  return {
    percent,
    owed,
    paid,
    remaining: Math.max(0, Math.round((owed - paid) * 100) / 100),
  };
}

export function investmentTotal(investments: CmsInvestment[]) {
  return investments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

export function monthStart(today = todayInDhaka()) {
  return `${today.slice(0, 7)}-01`;
}

export function weekStart(today = todayInDhaka()) {
  return shiftDate(today, -6);
}
