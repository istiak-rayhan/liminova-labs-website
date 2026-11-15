export type ProjectStatus = "pipeline" | "ongoing" | "completed";

export type LeadStage = "new" | "contacted" | "call" | "proposal" | "won" | "lost";

export type ProjectTask = {
  id: string;
  title: string;
  done: boolean;
};

export type ProjectPhase = {
  id: string;
  name: string;
  value: number;
};

export type ProjectReceipt = {
  id: string;
  amount: number;
  date: string;
  note: string;
};

export type ProjectShare = {
  memberId: string;
  percent: number;
};

export type CmsPayout = {
  id: string;
  projectId: string;
  memberId: string;
  amount: number;
  date: string;
  note: string;
};

export type CmsInvestment = {
  id: string;
  section: string;
  amount: number;
  date: string;
  note: string;
};

export type CmsProject = {
  id: string;
  slug: string;
  title: string;
  clientLine: string;
  category: string;
  industry: string;
  year: string;
  featured: boolean;
  status: ProjectStatus;
  published: boolean;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  role: string;
  before?: string;
  after?: string;
  quotation: string;
  /** Client company. Private. Not shown on the public site. */
  company?: string;
  /** Signed contract value in USD. */
  finalizedValue?: number;
  /** @deprecated mirror of finalizedValue for older saves */
  dealValue?: number;
  phases?: ProjectPhase[];
  receipts?: ProjectReceipt[];
  shares?: ProjectShare[];
  nextAction?: string;
  tasks?: ProjectTask[];
  timeline: string;
  partners: string[];
  metrics: { label: string; value: string }[];
  tech: string[];
  /** First image is the cover used on listings and case-study hero. */
  images: string[];
  liveUrl?: string;
  updatedAt: string;
};

export type TeamRole = "developer" | "partner" | "operations" | "leadership";

export type CmsTeamMember = {
  id: string;
  name: string;
  role: TeamRole;
  title: string;
  focus: string;
  active: boolean;
  updatedAt: string;
};

export type CmsLead = {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  stage: LeadStage;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsStore = {
  version: 1;
  projects: CmsProject[];
  team: CmsTeamMember[];
  leads: CmsLead[];
  payouts: CmsPayout[];
  investments: CmsInvestment[];
  updatedAt: string;
};
