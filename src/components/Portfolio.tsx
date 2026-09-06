"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

export default function Portfolio() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="portfolio" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Selected work
            </h2>
            <p className="text-slate-600 text-lg">
              Three production platforms: a language LMS, a ride-hailing client,
              and a fashion storefront. Case studies, not galleries.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            View all projects <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all ${
                project.featured
                  ? "lg:col-span-3 flex flex-col md:flex-row gap-10 items-center"
                  : "col-span-1"
              }`}
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0 w-full ${project.featured ? "md:w-1/2 aspect-[4/3] md:aspect-[16/10]" : "aspect-video mb-6"}`}
              >
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={
                    project.featured
                      ? "(min-width: 768px) 50vw, 100vw"
                      : "(min-width: 1024px) 33vw, 100vw"
                  }
                />
              </div>

              <div className="flex-col flex-grow">
                <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3 block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{project.summary}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md"
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
