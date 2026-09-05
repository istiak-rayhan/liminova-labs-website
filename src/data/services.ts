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
  icon: "code" | "growth" | "ai";
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
  },
  {
    slug: "advanced-tech-ai",
    title: "Advanced Tech & AI",
    eyebrow: "Extend",
    summary:
      "Python tools, REST APIs, and AI features that sit on top of a working product — not a slide deck.",
    description:
      "Once the core platform is live, we add the unglamorous leverage: internal tools, integrations, and AI features with a clear job (search, classification, assist). We will not bolt a chatbot onto a product that does not need one.",
    audience:
      "Product teams who have a workflow or dataset and want automation with an API they can own.",
    deliverables: [
      "Problem framing and data check",
      "Python services or scripts",
      "REST API design and docs",
      "AI/ML integration where it earns its keep",
      "Handoff with operations notes",
    ],
    timeline: "2–8 weeks for a focused tool or integration.",
    tags: ["Python", "AI & ML", "REST APIs"],
    icon: "ai",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
