export const site = {
  name: "Liminova Labs",
  legalName: "Liminova Labs",
  email: "liminovalabs@gmail.com",
  location: "Dhaka-based, serving globally",
  responseSla: "We reply within one business day (Dhaka time).",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://liminovalabs.io",
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8801355412144",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
  fiverr: process.env.NEXT_PUBLIC_FIVERR_URL ?? "",
  upwork: process.env.NEXT_PUBLIC_UPWORK_URL ?? "",
  title: "Liminova Labs | Digital Transformation Partner in Dhaka",
  description:
    "Digital transformation partner in Dhaka. Liminova Labs designs, ships, and grows product platforms for founders and agencies worldwide.",
  keywords: [
    "Flutter app development Dhaka",
    "Next.js development agency",
    "custom LMS development",
    "hire Flutter developer",
    "hire Next.js developer",
    "SEO and Meta Ads agency",
    "software studio Dhaka",
    "Liminova Labs",
  ],
} as const;

export function getWhatsAppHref() {
  if (!site.whatsapp) return null;
  const number = site.whatsapp.replace(/\D/g, "");
  if (!number) return null;
  const text = encodeURIComponent(
    "Hi Liminova Labs — I would like to discuss a project.",
  );
  return `https://wa.me/${number}?text=${text}`;
}

export function getBookingHref() {
  return "/book";
}

export function getMarketplaceLinks() {
  return [
    site.linkedin ? { label: "LinkedIn", href: site.linkedin } : null,
    site.fiverr ? { label: "Fiverr", href: site.fiverr } : null,
    site.upwork ? { label: "Upwork", href: site.upwork } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);
}
