"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsInvestment, CmsPayout, CmsProject, CmsTeamMember } from "@/lib/cms-types";
import { memberDue, money, todayInDhaka } from "@/lib/finance";
import { statusLabels } from "@/lib/report";

const sections = ["Tools", "Marketing", "Contractors", "Office", "Other"];

export default function BusinessDesk({
  projects,
  team,
  initialInvestments,
  initialPayouts,
}: {
  projects: CmsProject[];
  team: CmsTeamMember[];
  initialInvestments: CmsInvestment[];
  initialPayouts: CmsPayout[];
}) {
  const router = useRouter();
  const [investments, setInvestments] = useState(initialInvestments);
  const [payouts, setPayouts] = useState(initialPayouts);
  const [section, setSection] = useState(sections[0]);
  const [customSection, setCustomSection] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayInDhaka());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [payAmounts, setPayAmounts] = useState<Record<string, string>>({});

  const dues = useMemo(() => {
    const rows: {
      key: string;
      project: CmsProject;
      member: CmsTeamMember;
      percent: number;
      owed: number;
      paid: number;
      remaining: number;
    }[] = [];
    for (const project of projects) {
      for (const share of project.shares ?? []) {
        const member = team.find((item) => item.id === share.memberId);
        if (!member) continue;
        const due = memberDue(project, share.memberId, payouts);
        rows.push({ key: `${project.id}:${share.memberId}`, project, member, ...due });
      }
    }
    return rows.sort((a, b) => b.remaining - a.remaining || a.member.name.localeCompare(b.member.name));
  }, [projects, team, payouts]);

  async function send(body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/cms/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as {
        error?: string;
        investments?: CmsInvestment[];
        payouts?: CmsPayout[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not save.");
        return false;
      }
      if (data.investments) setInvestments(data.investments);
      if (data.payouts) setPayouts(data.payouts);
      router.refresh();
      return true;
    } catch {
      setError("Could not save.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900">Investment</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Record what the studio spends. Income above comes only from project receipts.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <label className="text-sm">
            <span className="font-medium text-slate-700">Section</span>
            <select
              value={section}
              onChange={(event) => setSection(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              {sections.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value="custom">Custom section</option>
            </select>
          </label>
          {section === "custom" ? (
            <label className="text-sm">
              <span className="font-medium text-slate-700">Section name</span>
              <input
                value={customSection}
                onChange={(event) => setCustomSection(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
          ) : null}
          <label className="text-sm">
            <span className="font-medium text-slate-700">Amount (USD)</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">Note</span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            const named = section === "custom" ? customSection.trim() : section;
            void send({
              kind: "investment",
              action: "add",
              section: named,
              amount: Number(amount),
              date,
              note,
            }).then((saved) => {
              if (!saved) return;
              setAmount("");
              setNote("");
            });
          }}
          className="rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Add investment
        </button>
        <ul className="mt-5 divide-y divide-slate-100">
          {investments.length === 0 ? (
            <li className="text-sm text-slate-500 py-2">No investment recorded yet.</li>
          ) : (
            investments.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                <span className="font-semibold text-slate-900">{item.section}</span>
                <span>{money(item.amount)}</span>
                <span className="text-slate-500">{item.date}</span>
                {item.note ? <span className="text-slate-500">{item.note}</span> : null}
                <button
                  type="button"
                  className="ml-auto text-xs font-semibold text-red-600"
                  onClick={() => void send({ kind: "investment", action: "delete", id: item.id })}
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900">Team dues</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Due is the assigned percent of money already received. Mark a payment and the remaining due drops.
        </p>
        {dues.length === 0 ? (
          <p className="text-sm text-slate-500">
            Assign a percent on a project first. Open Projects, edit the engagement, and set a team share.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2 pr-3 font-semibold">Person</th>
                  <th className="py-2 pr-3 font-semibold">Project</th>
                  <th className="py-2 pr-3 font-semibold">Share</th>
                  <th className="py-2 pr-3 font-semibold">Owed</th>
                  <th className="py-2 pr-3 font-semibold">Paid</th>
                  <th className="py-2 pr-3 font-semibold">Remaining</th>
                  <th className="py-2 font-semibold">Pay</th>
                </tr>
              </thead>
              <tbody>
                {dues.map((row) => (
                  <tr key={row.key} className="border-t border-slate-100">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-slate-900">{row.member.name}</p>
                      <p className="text-slate-500">{row.member.title}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="text-slate-900">{row.project.title}</p>
                      <p className="text-slate-500">{statusLabels[row.project.status]}</p>
                    </td>
                    <td className="py-3 pr-3">{row.percent}%</td>
                    <td className="py-3 pr-3">{money(row.owed)}</td>
                    <td className="py-3 pr-3">{money(row.paid)}</td>
                    <td className="py-3 pr-3 font-semibold">{money(row.remaining)}</td>
                    <td className="py-3">
                      {row.remaining <= 0 ? (
                        <span className="text-emerald-700 font-semibold">Paid</span>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            inputMode="decimal"
                            value={payAmounts[row.key] ?? String(row.remaining)}
                            onChange={(event) =>
                              setPayAmounts((current) => ({ ...current, [row.key]: event.target.value }))
                            }
                            className="w-24 rounded-xl border border-slate-200 px-2 py-1.5"
                            aria-label={`Pay ${row.member.name}`}
                          />
                          <button
                            type="button"
                            disabled={busy}
                            className="rounded-full bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
                            onClick={() =>
                              void send({
                                kind: "payout",
                                action: "add",
                                projectId: row.project.id,
                                memberId: row.member.id,
                                amount: Number(payAmounts[row.key] ?? row.remaining),
                                date: todayInDhaka(),
                                note: "",
                              })
                            }
                          >
                            Mark paid
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {payouts.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {payouts.map((payout) => {
              const member = team.find((item) => item.id === payout.memberId);
              const project = projects.find((item) => item.id === payout.projectId);
              return (
                <li key={payout.id} className="flex flex-wrap gap-2">
                  <span>
                    {money(payout.amount)} to {member?.name ?? "teammate"} · {project?.title ?? "project"} · {payout.date}
                  </span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600"
                    onClick={() => void send({ kind: "payout", action: "delete", id: payout.id })}
                  >
                    Undo
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
