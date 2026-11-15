"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Star, Upload, X } from "lucide-react";
import type { CmsProject, CmsTeamMember, ProjectStatus } from "@/lib/cms-types";
import { money, remainingOf, receivedOf } from "@/lib/finance";
import { statusLabels } from "@/lib/report";
import ProjectAccounts from "@/components/admin/ProjectAccounts";

const statuses: ProjectStatus[] = ["pipeline", "ongoing", "completed"];

const emptyForm = (): Omit<CmsProject, "updatedAt"> => ({
  id: "",
  slug: "",
  title: "",
  clientLine: "",
  category: "",
  industry: "",
  year: new Date().getFullYear().toString(),
  featured: false,
  status: "pipeline",
  published: false,
  summary: "",
  challenge: "",
  approach: "",
  outcome: "",
  role: "Product engineering",
  before: "",
  after: "",
  quotation: "",
  company: "",
  finalizedValue: undefined,
  dealValue: undefined,
  phases: [],
  receipts: [],
  shares: [],
  nextAction: "",
  tasks: [],
  timeline: "",
  partners: [],
  metrics: [
    { label: "Metric", value: "—" },
    { label: "Metric", value: "—" },
    { label: "Metric", value: "—" },
  ],
  tech: [],
  images: [],
  liveUrl: "",
});

export default function ProjectManager({
  initialProjects,
  team,
  filter,
  capability = "manage",
}: {
  initialProjects: CmsProject[];
  team: CmsTeamMember[];
  filter?: ProjectStatus;
  capability?: "manage" | "tasks" | "view";
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [partnersText, setPartnersText] = useState("");
  const [techText, setTechText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const visible = useMemo(
    () => (filter ? projects.filter((project) => project.status === filter) : projects),
    [projects, filter],
  );

  function startCreate() {
    const draft = emptyForm();
    draft.id = `proj_${Date.now().toString(36)}`;
    setEditing(draft);
    setPartnersText("");
    setTechText("");
  }

  function startEdit(project: CmsProject) {
    setEditing({ ...project });
    setPartnersText(project.partners.join(", "));
    setTechText(project.tech.join(", "));
  }

  async function uploadFiles(fileList: FileList | null) {
    if (!editing || !fileList?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(fileList)) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/cms/upload", {
          method: "POST",
          body,
        });
        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? `Failed to upload ${file.name}`);
        }
        const data = (await response.json()) as { url: string };
        uploaded.push(data.url);
      }
      setEditing({
        ...editing,
        images: [...editing.images, ...uploaded],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    if (!editing) return;
    setEditing({
      ...editing,
      images: editing.images.filter((image) => image !== url),
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    if (!editing) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= editing.images.length) return;
    const images = [...editing.images];
    const [item] = images.splice(index, 1);
    images.splice(nextIndex, 0, item);
    setEditing({ ...editing, images });
  }

  function setCoverImage(index: number) {
    if (!editing || index === 0) return;
    const images = [...editing.images];
    const [item] = images.splice(index, 1);
    images.unshift(item);
    setEditing({ ...editing, images });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    const payload: CmsProject = {
      ...editing,
      slug: editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      partners: partnersText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      tech: techText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      images: editing.images.length
        ? editing.images
        : ["/projects/bfrench-web.png"],
      company: editing.company ?? "",
      phases: editing.phases ?? [],
      receipts: editing.receipts ?? [],
      shares: editing.shares ?? [],
      finalizedValue: editing.finalizedValue,
      dealValue: editing.finalizedValue,
      updatedAt: new Date().toISOString(),
    };
    try {
      const response = await fetch("/api/cms/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Save failed.");
        return;
      }
      const saved = (await response.json()) as CmsProject;
      setProjects((current) => {
        const index = current.findIndex((project) => project.id === saved.id);
        if (index >= 0) {
          const next = [...current];
          next[index] = saved;
          return next;
        }
        return [saved, ...current];
      });
      setEditing(null);
      router.refresh();
    } catch {
      setError("Could not save project.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const response = await fetch(`/api/cms/projects?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!response.ok) return;
    setProjects((current) => current.filter((project) => project.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">
            {capability === "manage"
              ? "Website showcase and the private accounts for each engagement live here. Uncheck “Show on the website” to hide a project from the live site."
              : capability === "tasks"
                ? "These are the projects assigned to you. Edit updates the next step and tasks only."
                : "Project list for your role. Editing accounts and publishing is limited to leadership and operations."}
          </p>
        </div>
        {capability === "manage" ? (
          <button
            type="button"
            onClick={startCreate}
            className="rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold"
          >
            New project
          </button>
        ) : null}
      </div>

      {editing && capability === "tasks" ? (
        <form
          onSubmit={save}
          className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4"
        >
          <h2 className="font-semibold text-lg text-slate-900">{editing.title}</h2>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Next action</span>
            <input
              value={editing.nextAction ?? ""}
              onChange={(event) => setEditing({ ...editing, nextAction: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="font-medium text-slate-900 mb-3">Tasks</p>
            <ul className="space-y-2 mb-3">
              {(editing.tasks ?? []).map((task) => (
                <li key={task.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        tasks: (editing.tasks ?? []).map((item) =>
                          item.id === task.id ? { ...item, done: event.target.checked } : item,
                        ),
                      })
                    }
                  />
                  <span className={task.done ? "text-slate-400 line-through" : "text-slate-800"}>
                    {task.title}
                  </span>
                  <button
                    type="button"
                    className="ml-auto text-xs font-semibold text-red-600"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        tasks: (editing.tasks ?? []).filter((item) => item.id !== task.id),
                      })
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                id="dev-task"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Add a task"
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  const title = event.currentTarget.value.trim();
                  if (!title) return;
                  setEditing({
                    ...editing,
                    tasks: [
                      ...(editing.tasks ?? []),
                      { id: `task_${Date.now().toString(36)}`, title, done: false },
                    ],
                  });
                  event.currentTarget.value = "";
                }}
              />
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save tasks"}
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

      {editing && capability === "manage" ? (
        <form
          onSubmit={save}
          className="rounded-2xl bg-white border border-slate-200 p-6 grid md:grid-cols-2 gap-4"
        >
          <h2 className="md:col-span-2 font-semibold text-lg text-slate-900">
            {editing.title || "New project"}
          </h2>
          {(
            [
              ["title", "Title"],
              ["slug", "Slug"],
              ["clientLine", "Client line"],
              ["category", "Category"],
              ["industry", "Industry"],
              ["year", "Year"],
              ["role", "Role"],
              ["timeline", "Timeline"],
              ["quotation", "Quotation notes"],
              ["liveUrl", "Live URL"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="font-medium text-slate-700">{label}</span>
              <input
                value={String(editing[key] ?? "")}
                onChange={(event) =>
                  setEditing({ ...editing, [key]: event.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
          ))}
          <h3 className="md:col-span-2 font-semibold text-slate-900 pt-2">Website showcase</h3>
          <p className="md:col-span-2 text-sm text-slate-500 -mt-2">
            Description, banner, and gallery. This is what visitors see when the project is shown on the site.
          </p>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Summary</span>
            <textarea
              value={editing.summary}
              onChange={(event) =>
                setEditing({ ...editing, summary: event.target.value })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 min-h-20"
            />
          </label>
          {(["challenge", "approach", "outcome"] as const).map((key) => (
            <label key={key} className="block text-sm md:col-span-2">
              <span className="font-medium text-slate-700 capitalize">{key}</span>
              <textarea
                value={editing[key]}
                onChange={(event) =>
                  setEditing({ ...editing, [key]: event.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 min-h-20"
              />
            </label>
          ))}
          <label className="block text-sm md:col-span-1">
            <span className="font-medium text-slate-700">Before (case strip)</span>
            <textarea
              value={editing.before ?? ""}
              onChange={(event) =>
                setEditing({ ...editing, before: event.target.value })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 min-h-20"
              placeholder="Problem state before the engagement"
            />
          </label>
          <label className="block text-sm md:col-span-1">
            <span className="font-medium text-slate-700">After (case strip)</span>
            <textarea
              value={editing.after ?? ""}
              onChange={(event) =>
                setEditing({ ...editing, after: event.target.value })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 min-h-20"
              placeholder="Shipped surface after the engagement"
            />
          </label>
          <div className="flex flex-wrap items-center gap-6 md:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(event) =>
                  setEditing({ ...editing, published: event.target.checked })
                }
              />
              Show on the website
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(event) =>
                  setEditing({ ...editing, featured: event.target.checked })
                }
              />
              Feature on the homepage
            </label>
          </div>
          <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="font-medium text-slate-900">Banner and gallery</p>
                <p className="text-sm text-slate-500">
                  The first image is the banner on the website. The rest are gallery images.
                  Reorder or set the banner, then save. JPG, PNG, WebP — max 8MB each.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:border-emerald-300">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading…" : "Upload files"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  multiple
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) => {
                    void uploadFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>
            {editing.images.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {editing.images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white"
                  >
                    <Image
                      src={image}
                      alt="Project attachment"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {index === 0 ? (
                      <span className="absolute top-2 left-2 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        Banner
                      </span>
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-slate-900/70 p-1.5">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(index, -1)}
                          disabled={index === 0}
                          className="rounded-md bg-white/15 text-white p-1 disabled:opacity-30"
                          aria-label="Move image earlier"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, 1)}
                          disabled={index === editing.images.length - 1}
                          className="rounded-md bg-white/15 text-white p-1 disabled:opacity-30"
                          aria-label="Move image later"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverImage(index)}
                          disabled={index === 0}
                          className="rounded-md bg-white/15 text-white p-1 disabled:opacity-30"
                          aria-label="Set as banner"
                          title="Set as banner"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        className="rounded-md bg-white/15 text-white p-1"
                        aria-label="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No images yet.</p>
            )}
          </div>
          <h3 className="md:col-span-2 font-semibold text-slate-900 pt-2">Project management</h3>
          <p className="md:col-span-2 text-sm text-slate-500 -mt-2">
            Company, contract value, receipts, phases, and who is assigned. Hidden from the public site.
          </p>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Company</span>
            <input
              value={editing.company ?? ""}
              onChange={(event) => setEditing({ ...editing, company: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Client company"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Status</span>
            <select
              value={editing.status}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  status: event.target.value as ProjectStatus,
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Next action</span>
            <input
              value={editing.nextAction ?? ""}
              onChange={(event) =>
                setEditing({ ...editing, nextAction: event.target.value })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Send the scope note"
            />
          </label>
          <ProjectAccounts
            editing={editing}
            team={team}
            onChange={setEditing}
          />
          <div className="md:col-span-2 rounded-2xl border border-slate-200 p-4">
            <p className="font-medium text-slate-900 mb-3">Tasks</p>
            <ul className="space-y-2 mb-3">
              {(editing.tasks ?? []).map((task) => (
                <li key={task.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        tasks: (editing.tasks ?? []).map((item) =>
                          item.id === task.id ? { ...item, done: event.target.checked } : item,
                        ),
                      })
                    }
                  />
                  <span className={task.done ? "text-slate-400 line-through" : "text-slate-800"}>
                    {task.title}
                  </span>
                  <button
                    type="button"
                    className="ml-auto text-xs font-semibold text-red-600"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        tasks: (editing.tasks ?? []).filter((item) => item.id !== task.id),
                      })
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                id="new-task"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Add a task"
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  const input = event.currentTarget;
                  const title = input.value.trim();
                  if (!title) return;
                  setEditing({
                    ...editing,
                    tasks: [
                      ...(editing.tasks ?? []),
                      { id: `task_${Date.now().toString(36)}`, title, done: false },
                    ],
                  });
                  input.value = "";
                }}
              />
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold"
                onClick={() => {
                  const input = document.getElementById("new-task") as HTMLInputElement | null;
                  const title = input?.value.trim() ?? "";
                  if (!title || !input) return;
                  setEditing({
                    ...editing,
                    tasks: [
                      ...(editing.tasks ?? []),
                      { id: `task_${Date.now().toString(36)}`, title, done: false },
                    ],
                  });
                  input.value = "";
                }}
              >
                Add
              </button>
            </div>
          </div>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">
              Partners (comma-separated)
            </span>
            <input
              value={partnersText}
              onChange={(event) => setPartnersText(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">
              Tech tags (comma-separated)
            </span>
            <input
              value={techText}
              onChange={(event) => setTechText(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>

          {error ? (
            <p className="md:col-span-2 text-sm text-red-600">{error}</p>
          ) : null}
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save project"}
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

      <div className="rounded-2xl bg-white border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Project</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              {capability === "manage" ? (
                <>
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3 font-semibold">Remaining</th>
                  <th className="px-4 py-3 font-semibold">On site</th>
                </>
              ) : null}
              {capability !== "view" ? <th className="px-4 py-3 font-semibold">Edit</th> : null}
            </tr>
          </thead>
          <tbody>
            {visible.map((project) => (
              <tr key={project.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{project.title}</p>
                  <p className="text-slate-500">{project.company?.trim() || project.category}</p>
                </td>
                <td className="px-4 py-3">{statusLabels[project.status]}</td>
                {capability === "manage" ? (
                  <>
                    <td className="px-4 py-3">{money(receivedOf(project))}</td>
                    <td className="px-4 py-3">{money(remainingOf(project))}</td>
                    <td className="px-4 py-3">{project.published ? "Shown" : "Hidden"}</td>
                  </>
                ) : null}
                {capability !== "view" ? (
                  <td className="px-4 py-3 space-x-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => startEdit(project)}
                      className="text-emerald-700 font-semibold"
                    >
                      Edit
                    </button>
                    {capability === "manage" ? (
                      <button
                        type="button"
                        onClick={() => remove(project.id)}
                        className="text-red-600 font-semibold"
                      >
                        Delete
                      </button>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
