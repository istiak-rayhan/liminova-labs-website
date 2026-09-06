import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services } from "@/data/services";
import { site } from "@/data/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <main className="bg-white pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-16">
        <Link href="/services" className="text-emerald-600 font-semibold text-sm">
          All services
        </Link>
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mt-8 mb-3">
          {service.eyebrow}
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          {service.title}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          {service.description}
        </p>

        <h2 className="text-xl font-bold text-slate-900 mb-3">Who it is for</h2>
        <p className="text-slate-600 leading-relaxed mb-10">{service.audience}</p>

        <h2 className="text-xl font-bold text-slate-900 mb-4">What you leave with</h2>
        <ul className="space-y-2 text-slate-600 mb-10">
          {service.deliverables.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-emerald-500 mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>

        <p className="text-slate-500 mb-10">{service.timeline}</p>

        <div className="flex flex-wrap gap-2 mb-12">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href="/book"
          className="inline-flex px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium"
        >
          Book a consultation
        </Link>
        <p className="text-sm text-slate-500 mt-4">{site.responseSla}</p>
      </div>
    </main>
  );
}
