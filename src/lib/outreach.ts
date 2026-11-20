import type { CmsOutreach } from "@/lib/cms-types";

export type OutreachOutcome = "open" | "responded" | "aligned" | "converted" | "wasted";

export const outreachOutcomes: { id: OutreachOutcome; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "responded", label: "Responded" },
  { id: "aligned", label: "Aligned" },
  { id: "converted", label: "Converted" },
  { id: "wasted", label: "Wasted" },
];

export type OutreachFlags = Pick<CmsOutreach, "responded" | "aligned" | "converted" | "wasted">;

export type OutreachDraft = {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  source: string;
  credentials: string;
  approach: string;
  notes: string;
  firstMailSent: boolean;
  firstMailDate: string;
  secondMailSent: boolean;
  secondMailDate: string;
} & OutreachFlags;

const limits = {
  company: 160,
  contactName: 160,
  email: 160,
  phone: 40,
  source: 160,
  credentials: 4000,
  approach: 4000,
  notes: 4000,
} as const;

function text(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function date(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  return value;
}

function flag(value: unknown) {
  return value === true;
}

export function sanitizeOutreach(input: Partial<Record<keyof OutreachDraft, unknown>>): OutreachDraft | { error: string } {
  const company = text(input.company, limits.company);
  if (!company) return { error: "Company is required." };
  return {
    company,
    contactName: text(input.contactName, limits.contactName),
    email: text(input.email, limits.email),
    phone: text(input.phone, limits.phone),
    source: text(input.source, limits.source),
    credentials: text(input.credentials, limits.credentials),
    approach: text(input.approach, limits.approach),
    notes: text(input.notes, limits.notes),
    firstMailSent: flag(input.firstMailSent),
    firstMailDate: date(input.firstMailDate),
    secondMailSent: flag(input.secondMailSent),
    secondMailDate: date(input.secondMailDate),
    responded: flag(input.responded),
    aligned: flag(input.aligned),
    converted: flag(input.converted),
    wasted: flag(input.wasted),
  };
}

export function outcomeOf(lead: OutreachFlags): OutreachOutcome {
  if (lead.wasted) return "wasted";
  if (lead.converted) return "converted";
  if (lead.aligned) return "aligned";
  if (lead.responded) return "responded";
  return "open";
}

export function flagsForOutcome(outcome: OutreachOutcome): OutreachFlags {
  return {
    responded: outcome === "responded" || outcome === "aligned" || outcome === "converted",
    aligned: outcome === "aligned" || outcome === "converted",
    converted: outcome === "converted",
    wasted: outcome === "wasted",
  };
}

export function applyFlag(lead: OutreachFlags, flagName: keyof OutreachFlags, checked: boolean): OutreachFlags {
  const next: OutreachFlags = { ...lead };
  if (flagName === "wasted") {
    next.wasted = checked;
    if (checked) next.converted = false;
    return next;
  }
  if (flagName === "converted") {
    next.converted = checked;
    if (checked) {
      next.wasted = false;
      next.aligned = true;
      next.responded = true;
    }
    return next;
  }
  if (flagName === "aligned") {
    next.aligned = checked;
    if (checked) {
      next.responded = true;
      next.wasted = false;
    } else {
      next.converted = false;
    }
    return next;
  }
  next.responded = checked;
  if (checked) next.wasted = false;
  else {
    next.aligned = false;
    next.converted = false;
  }
  return next;
}

export function mailChange(sent: boolean, dateValue: string, today: string, fromDate: boolean) {
  if (fromDate) return { sent: Boolean(dateValue) || sent, date: dateValue };
  return { sent, date: sent && !dateValue ? today : dateValue };
}
