"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export default function Portfolio({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const rest = projects.filter((project) => project.slug !== featured?.slug);

  if (!featured) return null;

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Selected work
            </h2>
            <p className="text-slate-600 text-lg">
              Production platforms across LMS, inventory SaaS, civic prep,
              mobility, and retail — case studies, not galleries.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            View all projects <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-white/90 rounded-[1.75rem] p-6 border border-slate-200/80 shadow-[0_22px_50px_-28px_rgba(15,23,42,0.4)] hover:shadow-[0_30px_60px_-24px_rgba(15,23,42,0.45)] transition-all lg:col-span-3 flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="relative overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0 w-full md:w-1/2 aspect-[16/10]">
              <Image
                src={featured.images[0]}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="flex-col flex-grow">
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 block">
                {featured.category}
              </span>
              <h3 className="font-display text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                {featured.title}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{featured.summary}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {featured.tech.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <Link
                href={`/portfolio/${featured.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors"
              >
                Read the case study <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {rest.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white/90 rounded-[1.75rem] p-5 border border-slate-200/80 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.4)] hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgba(15,23,42,0.45)] transition-all"
            >
              <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-video mb-5">
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 block">
                {project.category}
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 mb-5 leading-relaxed text-sm">{project.summary}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <Link
                href={`/portfolio/${project.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors"
              >
                Read the case study <ExternalLink className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
