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
};

export const projects: Project[] = [
  {
    slug: "bfrench",
    title: "B-FRENCH",
    clientLine: "Language institute — French learning and civic-exam LMS",
    category: "EdTech / LMS",
    industry: "EdTech",
    year: "2024",
    featured: true,
    summary:
      "A cross-platform learning product that puts recorded lessons, live classes, civic-exam prep, and payments in one learner app.",
    challenge:
      "The institute needed one product for French language and civic-exam preparation in Bengali — not a generic course marketplace. Learners had to move between pre-recorded lessons, live Zoom sessions, practice, and payment without leaving the app.",
    approach:
      "We scoped the product around two learning tracks, then engineered a Flutter client with a Node.js API for catalog, progress, live-session entry, and payment. UI/UX stayed dark and focused so the academic content — not chrome — led the experience.",
    outcome:
      "A production LMS that combines live and recorded learning, in-app payments, and course tracking for a language institute. The same codebase ships on iOS and Android.",
    role: "Product design and platform engineering",
    metrics: [
      { value: "2", label: "Learning tracks in one app" },
      { value: "Live + recorded", label: "Lesson formats shipped" },
      { value: "In-app", label: "Payments and progress" },
    ],
    tech: ["Flutter", "Node.js", "REST API", "Payment Gateway", "UI/UX"],
    images: ["/projects/bfrench2.jpg", "/projects/bfrench3.jpg"],
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
