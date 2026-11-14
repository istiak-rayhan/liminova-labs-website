import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
import { createSeedStore } from "@/lib/cms-seed";
import type { CmsProject, CmsStore, CmsTeamMember, ProjectStatus } from "@/lib/cms-types";
import type { Project } from "@/data/projects";

const BLOB_KEY = "cms/store.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "cms-store.json");

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function streamToString(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(merged);
}

async function readLocal(): Promise<CmsStore | null> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    return JSON.parse(raw) as CmsStore;
  } catch {
    return null;
  }
}

async function writeLocal(store: CmsStore) {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function readBlob(): Promise<CmsStore | null> {
  try {
    const result = await get(BLOB_KEY, { access: "private", useCache: false });
    if (!result?.stream) return null;
    const raw = await streamToString(result.stream);
    return JSON.parse(raw) as CmsStore;
  } catch {
    return null;
  }
}

async function writeBlob(store: CmsStore) {
  await put(BLOB_KEY, JSON.stringify(store), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function getCmsStore(): Promise<CmsStore> {
  const existing = hasBlob() ? await readBlob() : await readLocal();
  if (existing?.version === 1) return existing;
  const seeded = createSeedStore();
  await saveCmsStore(seeded);
  return seeded;
}

export async function saveCmsStore(store: CmsStore) {
  const next = { ...store, updatedAt: new Date().toISOString() };
  if (hasBlob()) await writeBlob(next);
  else await writeLocal(next);
  return next;
}

export function cmsProjectToPublic(project: CmsProject): Project {
  return {
    slug: project.slug,
    title: project.title,
    clientLine: project.clientLine,
    category: project.category,
    industry: project.industry,
    year: project.year,
    featured: project.featured,
    summary: project.summary,
    challenge: project.challenge,
    approach: project.approach,
    outcome: project.outcome,
    role: project.role,
    metrics: project.metrics,
    tech: project.tech,
    images: project.images.length ? project.images : ["/projects/bfrench1.jpg"],
    liveUrl: project.liveUrl,
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const store = await getCmsStore();
  return store.projects
    .filter((project) => project.published && project.status === "completed")
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .map(cmsProjectToPublic);
}

export async function getPublishedProject(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function listProjectsByStatus(status?: ProjectStatus) {
  const store = await getCmsStore();
  if (!status) return store.projects;
  return store.projects.filter((project) => project.status === status);
}

export async function upsertProject(input: CmsProject) {
  const store = await getCmsStore();
  const index = store.projects.findIndex((project) => project.id === input.id);
  const next = { ...input, updatedAt: new Date().toISOString() };
  if (index >= 0) store.projects[index] = next;
  else store.projects.unshift(next);
  await saveCmsStore(store);
  return next;
}

export async function deleteProject(id: string) {
  const store = await getCmsStore();
  store.projects = store.projects.filter((project) => project.id !== id);
  await saveCmsStore(store);
}

export async function upsertTeamMember(input: CmsTeamMember) {
  const store = await getCmsStore();
  const index = store.team.findIndex((member) => member.id === input.id);
  const next = { ...input, updatedAt: new Date().toISOString() };
  if (index >= 0) store.team[index] = next;
  else store.team.unshift(next);
  await saveCmsStore(store);
  return next;
}

export async function deleteTeamMember(id: string) {
  const store = await getCmsStore();
  store.team = store.team.filter((member) => member.id !== id);
  await saveCmsStore(store);
}

export function newProjectId() {
  return `proj_${Date.now().toString(36)}`;
}

export function newTeamId() {
  return `team_${Date.now().toString(36)}`;
}
