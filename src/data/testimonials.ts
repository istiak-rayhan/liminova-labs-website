export type Testimonial = {
  quote: string;
  role: string;
  context: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "They treated the LMS as a product, not a content dump. Live classes, recorded lessons, payments, and a real admin ended up in one ecosystem our instructors could actually run.",
    role: "Head of Academics",
    context: "Language institute · EdTech",
  },
  {
    quote:
      "Inventory, receive/issue, and supplier records finally live in one ops workspace. We stopped juggling spreadsheets for day-to-day stock.",
    role: "Operations Manager",
    context: "France-based warehouse · SaaS",
  },
  {
    quote:
      "The civic prep app shipped with practice themes, mocks, and stats our candidates could use immediately — and it is live on Play Store.",
    role: "Product Lead",
    context: "Torc Digital · Mobile EdTech",
  },
];
