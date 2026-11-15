"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/track";
import type { Slot } from "@/lib/slots";

export default function BookingCalendar({ slots }: { slots: Slot[] }) {
  const [slotId, setSlotId] = useState(slots[0]?.id ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const days = useMemo(() => {
    const groups: { day: string; slots: Slot[] }[] = [];
    for (const slot of slots) {
      const last = groups[groups.length - 1];
      if (!last || last.day !== slot.day) groups.push({ day: slot.day, slots: [slot] });
      else last.slots.push(slot);
    }
    return groups;
  }, [slots]);

  const selected = slots.find((slot) => slot.id === slotId);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, note, slotId, website }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; label?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Could not book that time.");
        return;
      }
      setStatus("done");
      setMessage(payload.label ?? selected?.label ?? "Booked");
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

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="hidden" aria-hidden="true">
        <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      <div className="space-y-5">
        {days.map((group) => (
          <div key={group.day}>
            <p className="text-sm font-semibold text-slate-900 mb-2">{group.day}</p>
            <div className="flex flex-wrap gap-2">
              {group.slots.map((slot) => {
                const active = slot.id === slotId;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSlotId(slot.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${
                      active
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                    }`}
                    aria-pressed={active}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500">Times are Dhaka (UTC+6). Each call is 30 minutes.</p>
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
        disabled={status === "loading" || !slotId}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-full font-medium"
      >
        {status === "loading" ? "Booking…" : `Book ${selected?.time ?? "this time"}`}
      </button>
    </form>
  );
}
