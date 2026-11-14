"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code2, TrendingUp, Cpu, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";

const backgrounds: Record<string, string> = {
  "platform-engineering": "/services/platform.jpg",
  "brand-growth": "/services/growth.jpg",
  "advanced-tech-ai": "/services/ai.jpg",
  "technical-experts": "/services/experts.jpg",
};

const icons = {
  code: Code2,
  growth: TrendingUp,
  ai: Cpu,
  people: Users,
};

const accents = [
  {
    tint: "rgba(14,165,233,0.14)",
    icon: "bg-sky-500/15 text-sky-700 ring-sky-500/20",
    glow: "group-hover:shadow-sky-500/10",
    bar: "from-sky-400 to-sky-600",
  },
  {
    tint: "rgba(16,185,129,0.14)",
    icon: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20",
    glow: "group-hover:shadow-emerald-500/10",
    bar: "from-emerald-400 to-emerald-600",
  },
  {
    tint: "rgba(20,184,166,0.14)",
    icon: "bg-teal-500/15 text-teal-700 ring-teal-500/20",
    glow: "group-hover:shadow-teal-500/10",
    bar: "from-teal-400 to-teal-600",
  },
  {
    tint: "rgba(245,158,11,0.14)",
    icon: "bg-amber-500/15 text-amber-700 ring-amber-500/20",
    glow: "group-hover:shadow-amber-500/10",
    bar: "from-amber-400 to-amber-600",
  },
];

export default function Services() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_45%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1.5 px-3.5 rounded-full bg-white/80 border border-emerald-100 text-slate-600 text-xs font-semibold uppercase tracking-[0.14em] mb-5"
          >
            What we offer
          </motion.span>
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-[3rem] font-semibold text-slate-900 mb-6"
          >
            From evaluation to <span className="text-emerald-500">profit.</span>
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-600 text-lg leading-8"
          >
            We evaluate the brand, engineer the platform, then grow demand
            against something that can convert. Agencies can also hire a named
            technical expert into their own squad.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          {services.map((service, index) => {
            const Icon = icons[service.icon];
            const accent = accents[index % accents.length];
            return (
              <motion.div
                key={service.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`card-roomy group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-9 md:p-10 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.3)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(15,23,42,0.38)] flex flex-col ${accent.glow}`}
              >
                {backgrounds[service.slug] ? (
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <Image
                      src={backgrounds[service.slug]}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-right"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white from-20% via-white/90 to-white/58" />
                  </div>
                ) : null}
                <div className={`absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r ${accent.bar}`} />
                <div className="relative z-10 flex flex-col flex-grow">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-7 ring-1 transition-transform duration-500 group-hover:scale-110 ${accent.icon}`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                  {service.eyebrow}
                </p>
                <h3 className="font-display text-2xl font-semibold text-slate-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-[1.05rem] leading-8 mb-8 flex-grow">{service.summary}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/80 border border-slate-200/80 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors"
                >
                  Explore capabilities
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
