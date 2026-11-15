"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { roleAccess, roleLabels, roleOrder } from "@/lib/access";
import type { PublicTeamMember, TeamRole } from "@/lib/cms-types";

export default function TeamManager({
  initialTeam,
}: {
  initialTeam: PublicTeamMember[];
}) {
  const router = useRouter();
  const [team, setTeam] = useState(initialTeam);
  const [editing, setEditing] = useState<PublicTeamMember | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function startCreate() {
    setPassword("");
    setEditing({
      id: `team_${Date.now().toString(36)}`,
      name: "",
      role: "developer",
      title: "",
      focus: "",
      active: true,
      email: "",
      hasLogin: false,
      updatedAt: new Date().toISOString(),
    });
  }

  function startEdit(member: PublicTeamMember) {
    setPassword("");
    setEditing(member);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/cms/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, password: password.trim() || undefined }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Save failed.");
        return;
      }
      const saved = (await response.json()) as PublicTeamMember;
      setTeam((current) => {
        const index = current.findIndex((member) => member.id === saved.id);
        if (index >= 0) {
          const next = [...current];
          next[index] = saved;
          return next;
        }
        return [saved, ...current];
      });
      setEditing(null);
      setPassword("");
      router.refresh();
    } catch {
      setError("Could not save teammate.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this teammate?")) return;
    const response = await fetch(`/api/cms/team?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!response.ok) return;
    setTeam((current) => current.filter((member) => member.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Team</h1>
          <p className="text-slate-500 mt-1">
            Leadership sets each person’s role, email, and password. Leadership is above operations, then partner, then developer.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold"
        >
          Add member
        </button>
      </div>

      {editing ? (
        <form
          onSubmit={save}
          className="rounded-2xl bg-white border border-slate-200 p-6 grid md:grid-cols-2 gap-4"
        >
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Name</span>
            <input
              required
              value={editing.name}
              onChange={(event) =>
                setEditing({ ...editing, name: event.target.value })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Title</span>
            <input
              required
              value={editing.title}
              onChange={(event) =>
                setEditing({ ...editing, title: event.target.value })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Role</span>
            <select
              value={editing.role}
              onChange={(event) =>
                setEditing({ ...editing, role: event.target.value as TeamRole })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              {roleOrder.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-slate-500">{roleAccess[editing.role]}</span>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Login email</span>
            <input
              type="email"
              value={editing.email ?? ""}
              onChange={(event) => setEditing({ ...editing, email: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              placeholder="name@company.com"
              autoComplete="off"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              placeholder={editing.hasLogin ? "Leave blank to keep the current password" : "At least 8 characters"}
              autoComplete="new-password"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm pt-7">
            <input
              type="checkbox"
              checked={editing.active}
              onChange={(event) =>
                setEditing({ ...editing, active: event.target.checked })
              }
            />
            Active
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Focus</span>
            <textarea
              value={editing.focus}
              onChange={(event) =>
                setEditing({ ...editing, focus: event.target.value })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 min-h-20"
            />
          </label>
          {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save member"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid md:grid-cols-2 gap-4">
        {team.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl bg-white border border-slate-200 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{member.name}</p>
                <p className="text-sm text-slate-500">
                  {member.title} · {roleLabels[member.role]}
                </p>
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  member.active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {member.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-3">{member.focus}</p>
            <p className="text-sm text-slate-500 mt-2">
              {member.email ? member.email : "No login email"}
              {member.hasLogin ? " · password set" : ""}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => startEdit(member)}
                className="text-emerald-700 text-sm font-semibold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(member.id)}
                className="text-red-600 text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
