import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected Liminova Labs platforms: B-FRENCH language LMS, UrbanRide booking, and the Livira Fashion storefront.",
};

export default function PortfolioIndexPage() {
  return (
    <main className="bg-slate-50 pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-4">
          Portfolio
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
          Selected work
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mb-14">
          Three flagship platforms. Challenge, approach, and outcome — not a
          screenshot dump.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className={`group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl transition-shadow ${project.featured ? "md:col-span-2" : ""}`}
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-slate-100 mb-6 ${project.featured ? "aspect-[16/8]" : "aspect-video"}`}
              >
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">
                {project.industry} · {project.year}
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600">
                {project.title}
              </h2>
              <p className="text-slate-600">{project.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
