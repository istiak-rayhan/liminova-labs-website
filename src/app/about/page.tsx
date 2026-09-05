import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Liminova Labs is a Dhaka-based digital transformation partner. We evaluate, build, and grow product platforms — then stop when the work is not honest.",
};

const principles = [
  {
    title: "Evaluate before we build",
    body: "A build without a brand and funnel diagnosis is just a more expensive guess. Discovery is not a formality.",
  },
  {
    title: "One studio, one throat to choke",
    body: "Platform, design, and growth sit together. You will not discover a bench of unnamed contractors after kickoff.",
  },
  {
    title: "Growth only after conversion exists",
    body: "We will not buy traffic for a product that cannot hold it. Ads start when the platform can convert.",
  },
  {
    title: "Scope discipline is the offer",
    body: "We decline work we cannot staff, speculative rebuilds with no decision-maker, and vanity metrics.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-4">
          Company
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          A partner for the whole product loop.
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Liminova Labs is not a ticket queue. We are a small studio that takes a
          business from brand evaluation through Flutter and Next.js platforms,
          then into SEO and paid acquisition — when the product can actually
          convert.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 space-y-6 text-slate-600 leading-relaxed">
        <p>
          Most agencies stop at screens. Most freelancers stop at a repo. The
          gap in between — architecture, launch, and the first year of demand —
          is where products stall. We exist for that gap.
        </p>
        <p>
          We are {site.location.toLowerCase()}. English is the working language
          of the studio. Timezones are a feature, not an apology: overlap hours
          for reviews, async for everything else.
        </p>
        <p>
          The portfolio is intentionally short. B-FRENCH, UrbanRide, and Livira
          Fashion are production systems, not concept decks. We would rather
          show three platforms you can inspect than a wall of unnamed logos.
        </p>
        <p>
          Who we work with: founders and operators who can make a decision in a
          week. Who we will not take: teams shopping for the cheapest sprint,
          or growth campaigns against a product that cannot convert. That
          refusal is part of the standard.
        </p>
      </section>

      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
          {principles.map((item) => (
            <div key={item.title}>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h2>
              <p className="text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">How to start</h2>
        <p className="text-slate-600 leading-relaxed mb-8">
          Send a brief or pick a time. {site.responseSla} Direct email is the
          default. Marketplace gigs are a secondary path if that is how you
          already buy.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/book"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium"
          >
            Book a consultation
          </Link>
          <Link
            href="/#contact"
            className="px-6 py-3 bg-white border border-slate-200 rounded-full font-medium text-slate-700"
          >
            Send a brief
          </Link>
        </div>
      </section>
    </main>
  );
}
