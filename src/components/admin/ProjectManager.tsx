"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import type { CmsProject, ProjectStatus } from "@/lib/cms-types";

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
  quotation: "",
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
  filter,
}: {
  initialProjects: CmsProject[];
  filter?: ProjectStatus;
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
            Treat each engagement like inventory — pipeline, ongoing, completed.
            Published completed work appears on Selected work.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold"
        >
          New project
        </button>
      </div>

      {editing ? (
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
                  {status}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-6 pt-6">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(event) =>
                  setEditing({ ...editing, published: event.target.checked })
                }
              />
              Published on site
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(event) =>
                  setEditing({ ...editing, featured: event.target.checked })
                }
              />
              Featured
            </label>
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

          <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="font-medium text-slate-900">Project images</p>
                <p className="text-sm text-slate-500">
                  Upload screenshots directly (JPG, PNG, WebP — max 8MB each).
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editing.images.map((image) => (
                  <div
                    key={image}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white"
                  >
                    <Image
                      src={image}
                      alt="Project attachment"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute top-2 right-2 rounded-full bg-slate-900/70 text-white p-1"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No images yet.</p>
            )}
          </div>

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

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Project</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Published</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((project) => (
              <tr key={project.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{project.title}</p>
                  <p className="text-slate-500">{project.category}</p>
                </td>
                <td className="px-4 py-3 capitalize">{project.status}</td>
                <td className="px-4 py-3">{project.published ? "Yes" : "No"}</td>
                <td className="px-4 py-3 space-x-3">
                  <button
                    type="button"
                    onClick={() => startEdit(project)}
                    className="text-emerald-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(project.id)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
