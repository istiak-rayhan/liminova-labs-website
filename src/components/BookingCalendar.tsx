"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { track } from "@/lib/track";
import {
  clientZones,
  defaultClientZone,
  slotClock,
  slotDateKey,
  slotDateLabel,
  type Slot,
} from "@/lib/slots";

function onWeekday(slot: Slot, timeZone: string) {
  const day = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(new Date(slot.start));
  return day !== "Sat" && day !== "Sun";
}

function groupByDate(slots: Slot[], timeZone: string) {
  const groups: { key: string; label: string; slots: Slot[] }[] = [];
  for (const slot of slots) {
    if (!onWeekday(slot, timeZone)) continue;
    const key = slotDateKey(slot.start, timeZone);
    const last = groups[groups.length - 1];
    if (!last || last.key !== key) {
      groups.push({ key, label: slotDateLabel(slot.start, timeZone), slots: [slot] });
    } else last.slots.push(slot);
  }
  return groups;
}

export default function BookingCalendar({ slots }: { slots: Slot[] }) {
  const [zone, setZone] = useState(defaultClientZone);
  const [dateKey, setDateKey] = useState(slots[0] ? slotDateKey(slots[0].start, defaultClientZone) : "");
  const [slotId, setSlotId] = useState(slots[0]?.id ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const days = useMemo(() => groupByDate(slots, zone), [slots, zone]);
  const zoneLabel = clientZones.find((item) => item.id === zone)?.label ?? "US Eastern";
  const day = days.find((item) => item.key === dateKey) ?? days[0];
  const selected = slots.find((slot) => slot.id === slotId) ?? day?.slots[0];

  function chooseZone(next: string) {
    setZone(next);
    const groups = groupByDate(slots, next);
    const current = slots.find((slot) => slot.id === slotId && onWeekday(slot, next));
    if (current) {
      setDateKey(slotDateKey(current.start, next));
      return;
    }
    setDateKey(groups[0]?.key ?? "");
    setSlotId(groups[0]?.slots[0]?.id ?? "");
  }

  function chooseDate(next: string) {
    setDateKey(next);
    const group = days.find((item) => item.key === next);
    if (!group?.slots.some((slot) => slot.id === slotId)) setSlotId(group?.slots[0]?.id ?? "");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, note, slotId: selected.id, website }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Could not book that time.");
        return;
      }
      setStatus("done");
      setMessage(`${slotDateLabel(selected.start, zone)} · ${slotClock(selected.start, zone)} ${zoneLabel}`);
      track("booking_confirmed");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (slots.length === 0) {
    return <p className="text-slate-600">No open times in the next two weeks. Send a brief instead.</p>;
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Time held.</h2>
        <p className="text-slate-700 leading-relaxed">
          {message}. A confirmation is on its way to {email}. We reply within one business day if anything needs to move.
        </p>
      </div>
    );
  }

  const field =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none";
  const chosen = selected
    ? `${slotDateLabel(selected.start, zone)} · ${slotClock(selected.start, zone)}`
    : "Choose a time";

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <FieldSelect id="booking-zone" label="Timezone" value={zone} onChange={chooseZone}>
          {clientZones.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="booking-date" label="Date" value={day?.key ?? ""} onChange={chooseDate}>
          {days.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="booking-time" label="Time" value={selected?.id ?? ""} onChange={setSlotId}>
          {(day?.slots ?? []).map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slotClock(slot.start, zone)}
            </option>
          ))}
        </FieldSelect>
      </div>
      <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Selected</span>
        <span className="mt-1 block font-semibold text-slate-900">
          {chosen} · {zoneLabel}
        </span>
        <span className="mt-1 block text-xs">30 minutes. Weekdays only. We confirm by email.</span>
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input required value={name} onChange={(event) => setName(event.target.value)} className={`${field} mt-1`} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Work email
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={`${field} mt-1`} />
        </label>
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          Company
          <input required value={company} onChange={(event) => setCompany(event.target.value)} className={`${field} mt-1`} />
        </label>
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          What should we talk about?
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className={`${field} mt-1 resize-none`} />
        </label>
      </div>
      {status === "error" ? <p className="text-sm text-rose-600">{message}</p> : null}
      <button
        type="submit"
        disabled={status === "loading" || !selected}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-full font-medium"
      >
        {status === "loading" ? "Booking…" : `Hold ${chosen}`}
      </button>
    </form>
  );
}

function FieldSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <span className="relative mt-2 block">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </span>
    </label>
  );
}
