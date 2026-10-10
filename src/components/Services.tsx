"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code2, TrendingUp, Cpu, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { services } from "@/data/services";

const icons = {
  code: Code2,
  growth: TrendingUp,
  ai: Cpu,
  people: Users,
};

const accents = [
  {
    color: "bg-blue-100 text-blue-600",
    borderColor: "hover:border-blue-200",
    shadowColor: "hover:shadow-blue-900/5",
  },
  {
    color: "bg-emerald-100 text-emerald-600",
    borderColor: "hover:border-emerald-200",
    shadowColor: "hover:shadow-emerald-900/5",
  },
  {
    color: "bg-purple-100 text-purple-600",
    borderColor: "hover:border-purple-200",
    shadowColor: "hover:shadow-purple-900/5",
  },
  {
    color: "bg-amber-100 text-amber-600",
    borderColor: "hover:border-amber-200",
    shadowColor: "hover:shadow-amber-900/5",
  },
];

export default function Services() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-sm font-bold uppercase tracking-wider mb-4"
          >
            What we offer
          </motion.span>
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            From evaluation to <span className="text-emerald-500">profit.</span>
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-600 text-lg leading-relaxed"
          >
            We evaluate the brand, engineer the platform, then grow demand
            against something that can convert. Agencies can also hire a named
            technical expert into their own squad.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = icons[service.icon];
            const accent = accents[index];
            return (
              <motion.div
                key={service.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-slate-50 rounded-3xl p-8 border border-slate-100 transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl ${accent.borderColor} ${accent.shadowColor} flex flex-col h-full`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-300 ${accent.color}`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {service.eyebrow}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                  {service.summary}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mt-auto"
                >
                  Explore capabilities{" "}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
