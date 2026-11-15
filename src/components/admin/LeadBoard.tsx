"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsLead, LeadStage } from "@/lib/cms-types";
import { leadStages } from "@/lib/report";

export default function LeadBoard({
  initialLeads,
  canDelete = false,
}: {
  initialLeads: CmsLead[];
  canDelete?: boolean;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(initialLeads.map((lead) => [lead.id, lead.notes])),
  );
  const [error, setError] = useState("");

  async function patch(id: string, body: { stage?: LeadStage; notes?: string }) {
    setError("");
    const response = await fetch("/api/cms/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    if (!response.ok) {
      setError("Could not update that lead.");
      return;
    }
    const saved = (await response.json()) as CmsLead;
    setLeads((current) => current.map((lead) => (lead.id === saved.id ? saved : lead)));
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    const response = await fetch(`/api/cms/leads?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!response.ok) return;
    setLeads((current) => current.filter((lead) => lead.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Leads</h1>
        <p className="text-slate-500 mt-1">
          Every brief from the site lands here. Move it from new to won or lost.
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-500">
          No briefs yet. Submissions from the contact form will show up in New.
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 xl:grid-cols-6 gap-3 items-start">
          {leadStages.map((stage) => {
            const column = leads.filter((lead) => lead.stage === stage.id);
            return (
              <section key={stage.id} className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <header className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-800">{stage.label}</h2>
                  <span className="text-xs font-bold text-slate-400">{column.length}</span>
                </header>
                <div className="space-y-3">
                  {column.map((lead) => (
                    <article key={lead.id} className="rounded-xl bg-white border border-slate-200 p-3">
                      <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.company}</p>
                      <p className="text-xs text-emerald-700 mt-2">{lead.projectType}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {lead.budget} · {lead.timeline}
                      </p>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-4">{lead.message}</p>
                      <a href={`mailto:${lead.email}`} className="text-xs text-slate-500 mt-2 block">
                        {lead.email}
                      </a>
                      <label className="block mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Stage
                        <select
                          value={lead.stage}
                          onChange={(event) =>
                            void patch(lead.id, { stage: event.target.value as LeadStage })
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800"
                        >
                          {leadStages.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Notes
                        <textarea
                          value={notes[lead.id] ?? ""}
                          onChange={(event) =>
                            setNotes((current) => ({ ...current, [lead.id]: event.target.value }))
                          }
                          onBlur={() => {
                            if ((notes[lead.id] ?? "") !== lead.notes) {
                              void patch(lead.id, { notes: notes[lead.id] ?? "" });
                            }
                          }}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 min-h-16"
                        />
                      </label>
                      {canDelete ? (
                        <button
                          type="button"
                          onClick={() => remove(lead.id)}
                          className="mt-2 text-xs font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
