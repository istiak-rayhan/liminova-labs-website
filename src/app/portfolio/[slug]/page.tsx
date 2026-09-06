import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  getProject,
  getRelatedProjects,
  projects,
} from "@/data/projects";
import { site } from "@/data/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${site.name}`,
      description: project.summary,
    },
  };
}

export default async function ProjectDetails({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const related = getRelatedProjects(project.slug);

  return (
    <main className="bg-slate-50 pb-24">
      <div className="bg-white border-b border-slate-200 pt-16 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All work
          </Link>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            {project.category} · {project.year}
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {project.title}
          </h1>
          <p className="text-lg text-slate-500 mb-6">{project.clientLine}</p>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed mb-8">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 grid sm:grid-cols-3 gap-6">
        {project.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl bg-white border border-slate-100 p-6"
          >
            <p className="text-2xl font-extrabold text-slate-900">{metric.value}</p>
            <p className="text-sm text-slate-500 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-16 grid md:grid-cols-3 gap-10">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3">
            Challenge
          </h2>
          <p className="text-slate-600 leading-relaxed">{project.challenge}</p>
        </section>
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3">
            Approach
          </h2>
          <p className="text-slate-600 leading-relaxed">{project.approach}</p>
        </section>
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3">
            Outcome
          </h2>
          <p className="text-slate-600 leading-relaxed">{project.outcome}</p>
        </section>
      </div>

      <p className="max-w-5xl mx-auto px-6 mt-8 text-sm text-slate-500">
        Role: {project.role}.
      </p>

      <div className="max-w-5xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.images.map((img, index) => (
            <div
              key={img}
              className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm aspect-[4/3] ${index === 0 ? "md:col-span-2 md:aspect-[16/9]" : ""}`}
            >
              <Image
                src={img}
                alt={`${project.title} screenshot ${index + 1}`}
                fill
                className="object-contain p-4"
                sizes={index === 0 ? "100vw" : "50vw"}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-16 rounded-3xl bg-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Start a similar project</h2>
          <p className="text-slate-300">
            Same shape of problem? Send a brief. {site.responseSla}
          </p>
        </div>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-full font-medium"
        >
          Book a consultation <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {related.length > 0 ? (
        <div className="max-w-5xl mx-auto px-6 mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related work</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/portfolio/${item.slug}`}
                className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-shadow"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                  {item.industry}
                </p>
                <p className="text-lg font-bold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500 mt-2">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.summary,
            creator: { "@type": "Organization", name: site.name },
          }),
        }}
      />
    </main>
  );
}
