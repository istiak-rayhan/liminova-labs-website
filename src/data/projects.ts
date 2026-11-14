export type ProjectMetric = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  title: string;
  clientLine: string;
  category: string;
  industry: string;
  year: string;
  featured: boolean;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  role: string;
  metrics: ProjectMetric[];
  tech: string[];
  images: string[];
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "bfrench",
    title: "B-FRENCH",
    clientLine: "Language institute — full learning ecosystem for Bangla speakers in France",
    category: "EdTech / LMS",
    industry: "EdTech",
    year: "2024–2025",
    featured: true,
    summary:
      "A complete custom-built ecosystem: learner web app, Flutter mobile, and a 4-role dashboard covering courses, enrollments, exams, and operations.",
    challenge:
      "The institute needed one product for French language and civic-exam preparation — not a generic course marketplace. Learners, instructors, and admins each needed a real surface: catalog, live Zoom entry, practice, payments, and back-office control.",
    approach:
      "We engineered a full stack: a dark-mode Next.js learner web app, Flutter mobile clients, and a multi-role admin (overview, users, courses, enrollments, gradebook, exam banks, site content). Live sessions, recorded catalogs, and progress share one product model.",
    outcome:
      "A production LMS ecosystem live at b-french-web — web, mobile, and operations in one accountable build instead of bolted-together tools.",
    role: "Product design and full-stack platform engineering",
    metrics: [
      { value: "4", label: "Dashboard roles shipped" },
      { value: "Web + mobile", label: "Learner surfaces" },
      { value: "Live + recorded", label: "Lesson formats" },
    ],
    tech: ["Next.js", "Flutter", "Node.js", "REST API", "Payment Gateway"],
    images: [
      "/projects/bfrench-web.png",
      "/projects/bfrench-admin.png",
      "/projects/bfrench1.jpg",
      "/projects/bfrench2.jpg",
    ],
    liveUrl: "https://b-french-web.vercel.app/en",
  },
  {
    slug: "primexn",
    title: "PrimexN",
    clientLine: "France-based business — warehouse inventory operations",
    category: "SaaS / Inventory",
    industry: "SaaS",
    year: "2025",
    featured: false,
    summary:
      "Warehouse inventory management software for receiving, issuing, products, suppliers, documents, and stock movements — built for French operations.",
    challenge:
      "Operators needed a single workspace for stock availability, receive/issue actions, invoices, wastage, and supplier/customer records without juggling spreadsheets.",
    approach:
      "We shipped an operations dashboard with overview KPIs, quick actions, product/customer/supplier modules, stock movements, and expense tracking — structured for day-to-day warehouse workflows.",
    outcome:
      "A production inventory SaaS live at primexn.fr, giving the business a dedicated operations workspace instead of ad-hoc tooling.",
    role: "Product engineering and operations UI",
    metrics: [
      { value: "EUR", label: "Ops workspace for FR business" },
      { value: "Stock + docs", label: "Receive, issue, invoices" },
      { value: "Live", label: "primexn.fr in production" },
    ],
    tech: ["Next.js", "TypeScript", "Dashboard UX", "Inventory workflows"],
    images: ["/projects/primexn.png"],
    liveUrl: "https://primexn.fr/",
  },
  {
    slug: "prepcivic",
    title: "Prep-Civique",
    clientLine: "Torc Digital — French civic / naturalization exam prep",
    category: "EdTech / Mobile",
    industry: "EdTech",
    year: "2024",
    featured: false,
    summary:
      "French civic exam preparation app with practice themes, timed mock exams, multilingual support, and progress stats — live on Google Play.",
    challenge:
      "Torc Digital needed a mobile product for naturalization exam prep: themed practice, mock tests, statistics, and language support for candidates who are not yet fluent in French UI alone.",
    approach:
      "We built Prep-Civique around practice modules (Republic, history, values, institutions, society), timed 40-question mocks, candidate stats, and referral/premium paths — then shipped to Play Store under Torc Digital.",
    outcome:
      "A live Play Store app (com.torcdigital.prepcivique) candidates can install for structured civic exam preparation.",
    role: "Mobile product engineering",
    metrics: [
      { value: "Play Store", label: "Live consumer app" },
      { value: "40 Q", label: "Timed mock exams" },
      { value: "Multi-lang", label: "Practice for diverse candidates" },
    ],
    tech: ["Flutter", "Mobile UX", "Exam engine", "Play Store"],
    images: ["/projects/prepcivic1.png", "/projects/prepcivic2.png"],
    liveUrl:
      "https://play.google.com/store/apps/details?id=com.torcdigital.prepcivique&hl=en",
  },
  {
    slug: "urbanride",
    title: "UrbanRide",
    clientLine: "Urban mobility operator — rider booking and live tracking",
    category: "Ride-sharing",
    industry: "Mobility",
    year: "2024",
    featured: false,
    summary:
      "A Flutter booking app for urban rides: destination search, saved places, live maps, and payments without two native codebases.",
    challenge:
      "The operator needed rider booking, live tracking, and payments in market quickly. Building and maintaining separate iOS and Android apps would have delayed launch and split the product.",
    approach:
      "We designed the rider home around destination search, recents, and saved places, then implemented the stack in Flutter with Firebase and maps. Booking, tracking, and wallet-adjacent payment flows sit in one release train.",
    outcome:
      "A production ride-hailing client covering onboarding, home, journey, and pickup — ready for an operator to run rider and trip flows on both stores.",
    role: "Product design and mobile engineering",
    metrics: [
      { value: "1", label: "Codebase for iOS and Android" },
      { value: "Live maps", label: "Booking and trip tracking" },
      { value: "4", label: "Core rider screens shipped" },
    ],
    tech: ["Flutter", "Firebase", "Maps API", "Real-time DB"],
    images: [
      "/projects/Home.png",
      "/projects/Onboarding.png",
      "/projects/Journey.png",
      "/projects/pickup-1.png",
    ],
  },
  {
    slug: "livira-fashion",
    title: "Livira Fashion",
    clientLine: "Specialty fashion retailer — conversion-focused storefront",
    category: "Retail / Web",
    industry: "Retail",
    year: "2025",
    featured: false,
    summary:
      "A Next.js fashion storefront built for catalog merchandising, fast page loads, and a clean path from arrival to bag.",
    challenge:
      "A specialty fashion brand needed a storefront that treated photography as the product — not a sluggish theme with generic grids. Cart, wishlist, and merchandising had to feel native to a modern Next.js stack.",
    approach:
      "We built a high-contrast catalog in Next.js, React, and Tailwind with image-led product cards, collection navigation, and a checkout-ready bag. Stripe covers payment; the storefront stays static-friendly for speed.",
    outcome:
      "A production e-commerce surface the retailer can merchandise without fighting the theme layer — catalog, new arrivals, and cart UX on a single fast web app.",
    role: "Storefront engineering and UI implementation",
    metrics: [
      { value: "Next.js", label: "Storefront, not a heavyweight theme" },
      { value: "Catalog + bag", label: "Merchandising path shipped" },
      { value: "Stripe", label: "Checkout-ready payments" },
    ],
    tech: ["Next.js", "React", "Tailwind CSS", "Stripe"],
    images: ["/projects/e-comm1.jpg", "/projects/e-comm2.jpg"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string, count = 2) {
  return projects.filter((project) => project.slug !== slug).slice(0, count);
}
