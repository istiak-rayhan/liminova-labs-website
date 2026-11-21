"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsOutreach } from "@/lib/cms-types";
import { todayInDhaka } from "@/lib/finance";
import {
  applyFlag,
  flagsForOutcome,
  mailChange,
  outcomeOf,
  outreachOutcomes,
  type OutreachDraft,
  type OutreachFlags,
  type OutreachOutcome,
} from "@/lib/outreach";

type Filter = "all" | "unsent" | "first" | "second" | OutreachOutcome;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unsent", label: "Not mailed" },
  { id: "first", label: "First mail" },
  { id: "second", label: "Second mail" },
  { id: "open", label: "Open" },
  { id: "responded", label: "Responded" },
  { id: "aligned", label: "Aligned" },
  { id: "converted", label: "Converted" },
  { id: "wasted", label: "Wasted" },
];

const emptyDraft: OutreachDraft = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  source: "",
  credentials: "",
  approach: "",
  notes: "",
  firstMailSent: false,
  firstMailDate: "",
  secondMailSent: false,
  secondMailDate: "",
  responded: false,
  aligned: false,
  converted: false,
  wasted: false,
};

const outcomeTone: Record<OutreachOutcome, string> = {
  open: "bg-slate-100 text-slate-700",
  responded: "bg-sky-100 text-sky-800",
  aligned: "bg-amber-100 text-amber-800",
  converted: "bg-emerald-100 text-emerald-800",
  wasted: "bg-rose-100 text-rose-800",
};

function matches(lead: CmsOutreach, filter: Filter) {
  if (filter === "all") return true;
  if (filter === "unsent") return !lead.firstMailSent && !lead.wasted && !lead.converted;
  if (filter === "first") return lead.firstMailSent;
  if (filter === "second") return lead.secondMailSent;
  return outcomeOf(lead) === filter;
}

function toDraft(lead: CmsOutreach): OutreachDraft {
  return {
    company: lead.company,
    contactName: lead.contactName,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    credentials: lead.credentials,
    approach: lead.approach,
    notes: lead.notes,
    firstMailSent: lead.firstMailSent,
    firstMailDate: lead.firstMailDate,
    secondMailSent: lead.secondMailSent,
    secondMailDate: lead.secondMailDate,
    responded: lead.responded,
    aligned: lead.aligned,
    converted: lead.converted,
    wasted: lead.wasted,
  };
}

export default function OutreachDesk({ initialLeads }: { initialLeads: CmsOutreach[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [drafts, setDrafts] = useState<Record<string, OutreachDraft>>({});
  const [form, setForm] = useState(emptyDraft);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (!matches(lead, filter)) return false;
      if (!needle) return true;
      return [lead.company, lead.contactName, lead.email, lead.phone, lead.source, lead.approach]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [leads, filter, query]);

  const counts = useMemo(
    () => ({
      all: leads.length,
      unsent: leads.filter((lead) => matches(lead, "unsent")).length,
      responded: leads.filter((lead) => lead.responded).length,
      aligned: leads.filter((lead) => lead.aligned).length,
      converted: leads.filter((lead) => lead.converted).length,
      wasted: leads.filter((lead) => lead.wasted).length,
    }),
    [leads],
  );

  function draftOf(lead: CmsOutreach) {
    return drafts[lead.id] ?? toDraft(lead);
  }

  function editDraft(id: string, lead: CmsOutreach, patch: Partial<OutreachDraft>) {
    setDrafts((current) => ({ ...current, [id]: { ...(current[id] ?? toDraft(lead)), ...patch } }));
  }

  function persist(id: string | null, draft: OutreachDraft) {
    const job = saveQueue.current.then(async () => {
      setBusy(true);
      setError("");
      try {
        const response = await fetch("/api/cms/outreach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(id ? { id, ...draft } : draft),
        });
        const saved = (await response.json()) as CmsOutreach & { error?: string };
        if (!response.ok) {
          setError(saved.error ?? "Could not save that lead.");
          return null;
        }
        setLeads((current) => {
          const exists = current.some((lead) => lead.id === saved.id);
          const next = exists ? current.map((lead) => (lead.id === saved.id ? saved : lead)) : [saved, ...current];
          return next.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        });
        if (id) {
          setDrafts((current) => {
            const next = { ...current };
            delete next[id];
            return next;
          });
        }
        router.refresh();
        return saved;
      } finally {
        setBusy(false);
      }
    });
    saveQueue.current = job.then(
      () => undefined,
      () => undefined,
    );
    return job;
  }

  async function addLead() {
    const saved = await persist(null, form);
    if (saved) setForm(emptyDraft);
  }

  async function remove(id: string) {
    if (!confirm("Remove this cold lead?")) return;
    setError("");
    const response = await fetch(`/api/cms/outreach?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Could not remove that lead.");
      return;
    }
    setLeads((current) => current.filter((lead) => lead.id !== id));
    router.refresh();
  }

  function saveText(lead: CmsOutreach) {
    const draft = draftOf(lead);
    const current = toDraft(lead);
    const changed = (Object.keys(current) as (keyof OutreachDraft)[]).some((key) => draft[key] !== current[key]);
    if (changed) void persist(lead.id, draft);
  }

  function saveFlags(lead: CmsOutreach, flags: OutreachFlags) {
    const draft = { ...draftOf(lead), ...flags };
    editDraft(lead.id, lead, flags);
    void persist(lead.id, draft);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Cold outreach</h1>
        <p className="text-slate-500 mt-1 max-w-2xl">
          Collected leads stay here. Track the first and second mail, the approach, private credentials, and whether
          they responded, aligned, converted, or were wasted. Leadership only.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {(
          [
            ["Collected", counts.all, "bg-slate-900 text-white border-slate-900"],
            ["Not mailed", counts.unsent, "bg-sky-50 text-sky-950 border-sky-200"],
            ["Responded", counts.responded, "bg-indigo-50 text-indigo-950 border-indigo-200"],
            ["Aligned", counts.aligned, "bg-amber-50 text-amber-950 border-amber-200"],
            ["Converted", counts.converted, "bg-emerald-50 text-emerald-950 border-emerald-200"],
            ["Wasted", counts.wasted, "bg-rose-50 text-rose-950 border-rose-200"],
          ] as const
        ).map(([label, value, tone]) => (
          <div key={label} className={`rounded-2xl border px-4 py-3 ${tone}`}>
            <p className="text-[11px] font-bold uppercase tracking-wide opacity-70">{label}</p>
            <p className="text-2xl font-extrabold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl bg-white border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900">Add a collected lead</h2>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <Field label="Name" value={form.company} onChange={(company) => setForm({ ...form, company })} />
          <Field label="Contact" value={form.contactName} onChange={(contactName) => setForm({ ...form, contactName })} />
          <Field label="Email" value={form.email} onChange={(email) => setForm({ ...form, email })} type="email" />
          <Field label="Phone" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
          <Field label="Where collected" value={form.source} onChange={(source) => setForm({ ...form, source })} />
        </div>
        <div className="grid lg:grid-cols-2 gap-3 mt-3">
          <Area
            label="Approach context"
            value={form.approach}
            onChange={(approach) => setForm({ ...form, approach })}
          />
          <Area
            label="Client credentials"
            hint="Private. Portals, logins, or the person who can say yes."
            value={form.credentials}
            onChange={(credentials) => setForm({ ...form, credentials })}
          />
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void addLead()}
          className="mt-4 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Add lead
        </button>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                filter === item.id ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, contact, email"
          className="lg:ml-auto w-full lg:w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          aria-label="Search cold leads"
        />
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-500">
          {leads.length === 0 ? "No cold leads yet. Add the first name you want to approach." : "Nothing matches this filter."}
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((lead) => {
            const draft = draftOf(lead);
            const outcome = outcomeOf(draft);
            const open = openId === lead.id;
            const links = uniqueLinks(`${lead.credentials}\n${lead.approach}\n${lead.notes}`);
            return (
              <article key={lead.id} className="rounded-2xl bg-white border border-slate-200">
                <div className="flex items-start gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : lead.id)}
                      aria-expanded={open}
                      className="w-full text-left"
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">{lead.company || "Untitled"}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${outcomeTone[outcome]}`}>
                          {outreachOutcomes.find((option) => option.id === outcome)?.label}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-slate-500 truncate">
                        {[lead.contactName, lead.email, lead.phone].filter(Boolean).join(" · ") || "No contact yet"}
                      </span>
                      <span className="mt-1 block text-xs text-slate-400">
                        {lead.firstMailSent ? `First mail ${lead.firstMailDate || "sent"}` : "First mail not sent"}
                        {" · "}
                        {lead.secondMailSent ? `Second mail ${lead.secondMailDate || "sent"}` : "Second mail not sent"}
                      </span>
                    </button>
                    {links.length > 0 ? <LinkList text={`${lead.credentials}\n${lead.approach}\n${lead.notes}`} /> : null}
                  </div>
                  <button type="button" onClick={() => void remove(lead.id)} className="text-xs font-semibold text-red-600">
                    Remove
                  </button>
                </div>
                {open ? (
                <div className="border-t border-slate-100 p-5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-3">
                  <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Field
                      label="Name"
                      value={draft.company}
                      onChange={(company) => editDraft(lead.id, lead, { company })}
                      onBlur={() => saveText(lead)}
                    />
                    <Field
                      label="Contact"
                      value={draft.contactName}
                      onChange={(contactName) => editDraft(lead.id, lead, { contactName })}
                      onBlur={() => saveText(lead)}
                    />
                    <Field
                      label="Email"
                      type="email"
                      value={draft.email}
                      onChange={(email) => editDraft(lead.id, lead, { email })}
                      onBlur={() => saveText(lead)}
                    />
                    <Field
                      label="Phone"
                      value={draft.phone}
                      onChange={(phone) => editDraft(lead.id, lead, { phone })}
                      onBlur={() => saveText(lead)}
                    />
                    <Field
                      label="Where collected"
                      value={draft.source}
                      onChange={(source) => editDraft(lead.id, lead, { source })}
                      onBlur={() => saveText(lead)}
                    />
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Outcome
                      <select
                        value={outcome}
                        onChange={(event) => saveFlags(lead, flagsForOutcome(event.target.value as OutreachOutcome))}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
                      >
                        {outreachOutcomes.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  <MailRow
                    label="First mailing"
                    sent={draft.firstMailSent}
                    date={draft.firstMailDate}
                    onSent={(sent) => {
                      const next = mailChange(sent, draft.firstMailDate, todayInDhaka(), false);
                      const patch = { firstMailSent: next.sent, firstMailDate: next.date };
                      editDraft(lead.id, lead, patch);
                      void persist(lead.id, { ...draft, ...patch });
                    }}
                    onDate={(value) => {
                      const next = mailChange(draft.firstMailSent, value, todayInDhaka(), true);
                      const patch = { firstMailSent: next.sent, firstMailDate: next.date };
                      editDraft(lead.id, lead, patch);
                      void persist(lead.id, { ...draft, ...patch });
                    }}
                  />
                  <MailRow
                    label="Second mailing"
                    sent={draft.secondMailSent}
                    date={draft.secondMailDate}
                    onSent={(sent) => {
                      const next = mailChange(sent, draft.secondMailDate, todayInDhaka(), false);
                      const patch = { secondMailSent: next.sent, secondMailDate: next.date };
                      editDraft(lead.id, lead, patch);
                      void persist(lead.id, { ...draft, ...patch });
                    }}
                    onDate={(value) => {
                      const next = mailChange(draft.secondMailSent, value, todayInDhaka(), true);
                      const patch = { secondMailSent: next.sent, secondMailDate: next.date };
                      editDraft(lead.id, lead, patch);
                      void persist(lead.id, { ...draft, ...patch });
                    }}
                  />
                </div>

                <fieldset className="mt-4">
                  <legend className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Response</legend>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {(
                      [
                        ["responded", "Responded"],
                        ["aligned", "Aligned"],
                        ["converted", "Converted"],
                        ["wasted", "Wasted"],
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key} className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={draft[key]}
                          onChange={(event) => saveFlags(lead, applyFlag(draft, key, event.target.checked))}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid lg:grid-cols-3 gap-3 mt-4">
                  <div>
                    <Area
                      label="Approach context"
                      value={draft.approach}
                      onChange={(approach) => editDraft(lead.id, lead, { approach })}
                      onBlur={() => saveText(lead)}
                    />
                    <LinkList text={draft.approach} />
                  </div>
                  <div>
                    <Area
                      label="Client credentials"
                      hint="Private to leadership. Paste a full https link and it stays clickable."
                      value={draft.credentials}
                      onChange={(credentials) => editDraft(lead.id, lead, { credentials })}
                      onBlur={() => saveText(lead)}
                    />
                    <LinkList text={draft.credentials} />
                  </div>
                  <div>
                    <Area
                      label="Notes"
                      value={draft.notes}
                      onChange={(notes) => editDraft(lead.id, lead, { notes })}
                      onBlur={() => saveText(lead)}
                    />
                    <LinkList text={draft.notes} />
                  </div>
                </div>
                </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function uniqueLinks(text: string) {
  const found = text.match(/https?:\/\/[^\s<>"']+/g) ?? [];
  return [...new Set(found.map((url) => url.replace(/[),.;]+$/, "")))];
}

function LinkList({ text }: { text: string }) {
  const links = uniqueLinks(text);
  if (links.length === 0) return null;
  return (
    <p className="mt-2 flex flex-wrap gap-2">
      {links.map((url) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-emerald-700 underline break-all"
        >
          {url.replace(/^https?:\/\//, "")}
        </a>
      ))}
    </p>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: string;
}) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
      />
    </label>
  );
}

function Area({
  label,
  hint,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      {label}
      {hint ? <span className="block normal-case tracking-normal font-medium text-slate-400 mt-0.5">{hint}</span> : null}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm font-medium normal-case tracking-normal text-slate-800 min-h-24"
      />
    </label>
  );
}

function MailRow({
  label,
  sent,
  date,
  onSent,
  onDate,
}: {
  label: string;
  sent: boolean;
  date: string;
  onSent: (sent: boolean) => void;
  onDate: (date: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 px-3 py-2 flex flex-wrap items-center gap-3">
      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input type="checkbox" checked={sent} onChange={(event) => onSent(event.target.checked)} />
        {label}
      </label>
      <input
        type="date"
        value={date}
        onChange={(event) => onDate(event.target.value)}
        aria-label={`${label} date`}
        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800"
      />
    </div>
  );
}
