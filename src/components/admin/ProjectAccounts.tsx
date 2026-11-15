"use client";

import type { CmsProject, CmsTeamMember } from "@/lib/cms-types";
import { finalizedOf, money, receivedOf, remainingOf, todayInDhaka } from "@/lib/finance";

type Draft = Omit<CmsProject, "updatedAt">;

export default function ProjectAccounts({
  editing,
  team,
  onChange,
}: {
  editing: Draft;
  team: CmsTeamMember[];
  onChange: (next: Draft) => void;
}) {
  const finalized = finalizedOf(editing as CmsProject);
  const received = receivedOf(editing as CmsProject);
  const remaining = remainingOf(editing as CmsProject);
  const phaseTotal = (editing.phases ?? []).reduce((sum, phase) => sum + (Number(phase.value) || 0), 0);
  const shareTotal = (editing.shares ?? []).reduce((sum, share) => sum + (Number(share.percent) || 0), 0);

  function setFinalized(raw: string) {
    const trimmed = raw.trim();
    const value = trimmed === "" ? undefined : Number(trimmed);
    const finalizedValue = value !== undefined && Number.isFinite(value) ? value : undefined;
    onChange({ ...editing, finalizedValue, dealValue: finalizedValue });
  }

  return (
    <div className="md:col-span-2 rounded-2xl border border-slate-200 p-4 space-y-5">
      <div>
        <h3 className="font-semibold text-slate-900">Accounts</h3>
        <p className="text-sm text-slate-500 mt-1">
          Private. These numbers stay in the dashboard and feed Reports and Business.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <label className="block text-sm sm:col-span-1">
          <span className="font-medium text-slate-700">Finalized value (USD)</span>
          <input
            inputMode="decimal"
            value={editing.finalizedValue ?? editing.dealValue ?? ""}
            onChange={(event) => setFinalized(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            placeholder="15000"
          />
        </label>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Received</p>
          <p className="text-lg font-bold text-slate-900">{money(received)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Remaining</p>
          <p className="text-lg font-bold text-slate-900">{money(remaining)}</p>
        </div>
      </div>

      <div>
        <p className="font-medium text-slate-900 mb-2">Phases</p>
        <ul className="space-y-2 mb-3">
          {(editing.phases ?? []).map((phase) => (
            <li key={phase.id} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-slate-800">{phase.name}</span>
              <span className="text-slate-500">{money(phase.value)}</span>
              <button
                type="button"
                className="ml-auto text-xs font-semibold text-red-600"
                onClick={() =>
                  onChange({
                    ...editing,
                    phases: (editing.phases ?? []).filter((item) => item.id !== phase.id),
                  })
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <input
            id="phase-name"
            className="flex-1 min-w-40 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Phase name"
          />
          <input
            id="phase-value"
            inputMode="decimal"
            className="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="USD"
          />
          <button
            type="button"
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold"
            onClick={() => {
              const nameInput = document.getElementById("phase-name") as HTMLInputElement | null;
              const valueInput = document.getElementById("phase-value") as HTMLInputElement | null;
              const name = nameInput?.value.trim() ?? "";
              const value = Number(valueInput?.value);
              if (!name || !Number.isFinite(value)) return;
              onChange({
                ...editing,
                phases: [
                  ...(editing.phases ?? []),
                  { id: `phase_${Date.now().toString(36)}`, name, value },
                ],
              });
              if (nameInput) nameInput.value = "";
              if (valueInput) valueInput.value = "";
            }}
          >
            Add phase
          </button>
        </div>
        {phaseTotal > 0 && finalized > 0 && phaseTotal !== finalized ? (
          <p className="text-xs text-amber-700 mt-2">
            Phases add up to {money(phaseTotal)}. Finalized value is {money(finalized)}.
          </p>
        ) : null}
      </div>

      <div>
        <p className="font-medium text-slate-900 mb-2">Money received</p>
        <ul className="space-y-2 mb-3">
          {(editing.receipts ?? []).map((receipt) => (
            <li key={receipt.id} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-slate-800">{money(receipt.amount)}</span>
              <span className="text-slate-500">{receipt.date}</span>
              {receipt.note ? <span className="text-slate-500">{receipt.note}</span> : null}
              <button
                type="button"
                className="ml-auto text-xs font-semibold text-red-600"
                onClick={() =>
                  onChange({
                    ...editing,
                    receipts: (editing.receipts ?? []).filter((item) => item.id !== receipt.id),
                  })
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <input
            id="receipt-amount"
            inputMode="decimal"
            className="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="USD"
          />
          <input
            id="receipt-date"
            type="date"
            defaultValue={todayInDhaka()}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            id="receipt-note"
            className="flex-1 min-w-40 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Note, optional"
          />
          <button
            type="button"
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold"
            onClick={() => {
              const amountInput = document.getElementById("receipt-amount") as HTMLInputElement | null;
              const dateInput = document.getElementById("receipt-date") as HTMLInputElement | null;
              const noteInput = document.getElementById("receipt-note") as HTMLInputElement | null;
              const amount = Number(amountInput?.value);
              const date = dateInput?.value ?? "";
              if (!Number.isFinite(amount) || amount <= 0 || !date) return;
              onChange({
                ...editing,
                receipts: [
                  ...(editing.receipts ?? []),
                  {
                    id: `rcpt_${Date.now().toString(36)}`,
                    amount,
                    date,
                    note: noteInput?.value.trim() ?? "",
                  },
                ],
              });
              if (amountInput) amountInput.value = "";
              if (noteInput) noteInput.value = "";
            }}
          >
            Add receipt
          </button>
        </div>
      </div>

      <div>
        <p className="font-medium text-slate-900 mb-1">Team share</p>
        <p className="text-sm text-slate-500 mb-2">
          A person’s due is their percent of money received, not of the full contract.
        </p>
        <ul className="space-y-2 mb-3">
          {(editing.shares ?? []).map((share) => {
            const member = team.find((item) => item.id === share.memberId);
            return (
              <li key={share.memberId} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-slate-800">{member?.name ?? "Former teammate"}</span>
                <span className="text-slate-500">{share.percent}%</span>
                <button
                  type="button"
                  className="ml-auto text-xs font-semibold text-red-600"
                  onClick={() =>
                    onChange({
                      ...editing,
                      shares: (editing.shares ?? []).filter((item) => item.memberId !== share.memberId),
                    })
                  }
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
        {team.length === 0 ? (
          <p className="text-sm text-slate-500">Add someone on the Team page before assigning a share.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <select id="share-member" className="flex-1 min-w-40 rounded-xl border border-slate-200 px-3 py-2 text-sm" defaultValue="">
              <option value="">Choose a person</option>
              {team.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} · {member.title}
                </option>
              ))}
            </select>
            <input
              id="share-percent"
              inputMode="decimal"
              className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="%"
            />
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold"
              onClick={() => {
                const memberInput = document.getElementById("share-member") as HTMLSelectElement | null;
                const percentInput = document.getElementById("share-percent") as HTMLInputElement | null;
                const memberId = memberInput?.value ?? "";
                const percent = Number(percentInput?.value);
                if (!memberId || !Number.isFinite(percent) || percent <= 0 || percent > 100) return;
                const others = (editing.shares ?? []).filter((item) => item.memberId !== memberId);
                onChange({ ...editing, shares: [...others, { memberId, percent }] });
                if (percentInput) percentInput.value = "";
              }}
            >
              Set share
            </button>
          </div>
        )}
        {shareTotal > 100 ? (
          <p className="text-xs text-amber-700 mt-2">Shares add up to {shareTotal}%. That is over 100%.</p>
        ) : null}
      </div>
    </div>
  );
}
