export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  audience: string;
  deliverables: string[];
  timeline: string;
  tags: string[];
  icon: "code" | "growth" | "ai" | "people";
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "platform-engineering",
    title: "Platform Engineering",
    eyebrow: "Build",
    summary:
      "Custom web apps, Flutter clients, admin panels, and LMS platforms — one product, not a pile of tools.",
    description:
      "We design and ship the systems your customers actually use: Next.js web apps, Flutter iOS/Android clients, and the APIs and admin surfaces that keep them honest. Architecture is scoped for the next two years, not a demo week.",
    audience:
      "Founders and operators who need a real product surface — learning, mobility, commerce, or an internal platform — without hiring a full engineering org.",
    deliverables: [
      "Product discovery and information architecture",
      "UI/UX for the primary customer journey",
      "Next.js or Flutter implementation",
      "API, auth, and admin as required",
      "Launch support on web or storefronts",
    ],
    timeline: "Typical build: 6–16 weeks depending on scope.",
    tags: ["Flutter & Dart", "Next.js", "Node.js"],
    icon: "code",
    seoTitle: "Flutter and Next.js Development",
    seoDescription:
      "Liminova Labs builds Flutter apps, Next.js platforms, admin tools, and custom LMS products for teams that need one studio, not a pile of vendors. Based in Dhaka, working worldwide.",
  },
  {
    slug: "brand-growth",
    title: "Brand & Growth Marketing",
    eyebrow: "Grow",
    summary:
      "SEO, social, and Meta Ads after the product exists — acquisition tied to what you actually shipped.",
    description:
      "We do not run ads against a broken funnel. Growth work starts from the product: landing pages, offer, and measurement. Then SEO, social, and Meta campaigns that send traffic a real platform can convert.",
    audience:
      "Teams that already have — or are about to ship — a product and need demand, not vanity reach.",
    deliverables: [
      "Brand and offer evaluation",
      "SEO-ready landing pages",
      "Social system and content cadence",
      "Meta Ads setup and iteration",
      "Conversion notes back to product",
    ],
    timeline: "Sprints of 30 days; retainers once the channel is proven.",
    tags: ["Meta Ads", "SEO", "Social Media"],
    icon: "growth",
    seoTitle: "SEO and Meta Ads",
    seoDescription:
      "SEO, social, and Meta Ads for product teams — only after the platform can convert. Liminova Labs ties acquisition to the product that was actually shipped.",
  },
  {
    slug: "advanced-tech-ai",
    title: "Advanced Tech & AI",
    eyebrow: "Extend",
    summary:
      "Python tools, REST APIs, OCR/POS integrations, and AI features that sit on top of a working product.",
    description:
      "Once the core platform is live, we add leverage: internal tools, hardware-aware integrations, and AI features with a clear job (search, classification, assist). We will not bolt a chatbot onto a product that does not need one.",
    audience:
      "Product teams who have a workflow, dataset, or device stack and want automation with an API they can own.",
    deliverables: [
      "Problem framing and data check",
      "Python services or scripts",
      "REST API design and docs",
      "AI/ML or OCR integration where it earns its keep",
      "Handoff with operations notes",
    ],
    timeline: "2–8 weeks for a focused tool or integration.",
    tags: ["Python", "AI & OCR", "REST APIs"],
    icon: "ai",
    seoTitle: "AI, OCR, and API Integrations",
    seoDescription:
      "Python tools, REST APIs, OCR, POS, and practical AI features added to a working product. Liminova Labs builds the integration and hands it over.",
  },
  {
    slug: "technical-experts",
    title: "Technical Experts",
    eyebrow: "Staff",
    summary:
      "Agencies and product teams can hire a named Flutter, Next.js, or backend expert from us — embedded, not anonymous bench.",
    description:
      "Some partners need a person, not a whole build. We place a skilled engineer or product specialist inside your squad: Flutter, Next.js, Node, or growth. They work under your standups and tools. We stay accountable for quality and replacement if the fit is wrong.",
    audience:
      "Agencies, consultancies, and product companies that need senior capacity without a full-time hire — or a studio that wants a trusted specialist on a client account.",
    deliverables: [
      "Named expert, not a rotating bench",
      "Flutter, Next.js, Node, or growth profiles",
      "Weekly reporting back to your lead",
      "Overlap hours with your timezone",
      "Swap or extend with two weeks’ notice",
    ],
    timeline: "Typical embedding: 4–12 weeks, part-time or full-time.",
    tags: ["Flutter", "Next.js", "Embedded"],
    icon: "people",
    seoTitle: "Hire a Flutter or Next.js Developer",
    seoDescription:
      "Hire a named Flutter, Next.js, or backend engineer from Liminova Labs. Embedded in your squad, with a real person and overlap hours — not an anonymous bench.",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
