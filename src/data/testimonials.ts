export type Testimonial = {
  quote: string;
  role: string;
  context: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "They treated the LMS as a product, not a content dump. Live classes, recorded lessons, and payments ended up in one app our instructors could actually run.",
    role: "Head of Academics",
    context: "Language institute · EdTech",
  },
  {
    quote:
      "We needed rider booking and live tracking without two native teams. The Flutter client covered onboarding through pickup in a single release.",
    role: "Operations Lead",
    context: "Urban mobility operator",
  },
  {
    quote:
      "The storefront finally matches how we merchandise. Fast pages, a clean bag, and a catalog that does not fight the photography.",
    role: "Founder",
    context: "Specialty fashion retail",
  },
];
