import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Platform engineering, brand and growth marketing, and applied AI — the three Liminova Labs pillars.",
};

export default function ServicesIndexPage() {
  return (
    <main className="bg-white pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-4">
          Services
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          What we take on
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mb-14">
          Three capabilities. You can buy one, or the whole loop from evaluation
          to growth.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-8 hover:shadow-lg transition-shadow"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">
                {service.eyebrow}
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {service.title}
              </h2>
              <p className="text-slate-600">{service.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
