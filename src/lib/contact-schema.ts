import { z } from "zod";

export const projectTypes = [
  "Platform engineering",
  "Brand & growth",
  "Advanced tech & AI",
  "Not sure yet",
] as const;

export const budgetBands = [
  "Exploring",
  "Under $5k",
  "$5k–$15k",
  "$15k+",
] as const;

export const timelines = [
  "ASAP",
  "1–3 months",
  "3+ months",
  "Exploring",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.email("Enter a valid work email"),
  company: z.string().trim().min(1, "Company is required").max(120),
  projectType: z.enum(projectTypes),
  budget: z.enum(budgetBands),
  timeline: z.enum(timelines),
  message: z.string().trim().min(20, "Add a bit more detail").max(4000),
  consent: z.boolean().refine((value) => value === true, "Consent is required"),
  website: z.string().max(0).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
