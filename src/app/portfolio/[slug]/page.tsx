import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import TrackLink from "@/components/TrackLink";
import { projects } from "@/data/projects";
import { getPublishedProject, getPublishedProjects } from "@/lib/cms";
import { site } from "@/data/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return { title: "Project" };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${project.title} | ${site.name}`,
      description: project.summary,
      url: `/portfolio/${project.slug}`,
    },
  };
}

export default async function ProjectDetails({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);

  if (!project) notFound();

  const all = await getPublishedProjects();
  const related = all.filter((item) => item.slug !== project.slug).slice(0, 2);
  const cover = project.images[0];
  const gallery = project.images.slice(1);

  return (
    <main className="pb-24">
      <div className="bg-white/80 border-b border-slate-200 pt-16 pb-12">
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
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {project.title}
          </h1>
          <p className="text-lg text-slate-500 mb-6">{project.clientLine}</p>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed mb-8">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {tech}
              </span>
            ))}
          </div>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800"
            >
              Open live project <ExternalLink className="w-4 h-4" />
            </a>
          ) : null}
        </div>
      </div>

      {cover ? (
        <div className="relative w-full aspect-[21/9] min-h-[220px] max-h-[520px] bg-slate-950 border-b border-slate-200">
          <Image
            src={cover}
            alt={`${project.title} product surface`}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>
      ) : null}

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

      {project.before && project.after ? (
        <div className="max-w-5xl mx-auto px-6 mt-12">
          <div className="grid md:grid-cols-2 gap-4 rounded-[1.75rem] border border-slate-200 bg-white overflow-hidden">
            <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/80">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
                Before
              </p>
              <p className="text-slate-700 leading-relaxed">{project.before}</p>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 mb-3">
                After
              </p>
              <p className="text-slate-700 leading-relaxed">{project.after}</p>
            </div>
          </div>
        </div>
      ) : null}

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

      {gallery.length > 0 ? (
        <div className="max-w-5xl mx-auto px-6 mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gallery.map((img, index) => (
              <div
                key={img}
                className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm aspect-[4/3] ${index === 0 && gallery.length > 1 ? "" : ""}`}
              >
                <Image
                  src={img}
                  alt={`${project.title} screenshot ${index + 2}`}
                  fill
                  className="object-contain p-4"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="max-w-5xl mx-auto px-6 mt-16 rounded-3xl bg-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Start a similar project</h2>
          <p className="text-slate-300">
            Same shape of problem? Send a brief. {site.responseSla}
          </p>
        </div>
        <TrackLink
          href="/book"
          event="cta_book_case_study"
          eventData={{ project: project.slug }}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-full font-medium"
        >
          Book a consultation <ArrowRight className="w-4 h-4" />
        </TrackLink>
      </div>

      {related.length > 0 ? (
        <div className="max-w-5xl mx-auto px-6 mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related work</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map((item) => (
              <TrackLink
                key={item.slug}
                href={`/portfolio/${item.slug}`}
                event="case_study_related"
                eventData={{ project: item.slug }}
                className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-shadow"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                  {item.industry}
                </p>
                <p className="text-lg font-bold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500 mt-2">{item.summary}</p>
              </TrackLink>
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
