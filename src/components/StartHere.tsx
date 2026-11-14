"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, TrendingUp, Users, HelpCircle } from "lucide-react";
import { track } from "@/lib/track";

const paths = [
  {
    title: "Build a product",
    blurb: "App, web, LMS, admin, or ops SaaS — scoped and shipped.",
    href: "/services/platform-engineering",
    icon: Code2,
    accent: "from-sky-50 to-white border-sky-200/80 text-sky-700",
    event: "start_here_build",
  },
  {
    title: "Grow demand",
    blurb: "SEO, social, Meta Ads — only after the funnel can convert.",
    href: "/services/brand-growth",
    icon: TrendingUp,
    accent: "from-emerald-50 to-white border-emerald-200/80 text-emerald-700",
    event: "start_here_grow",
  },
  {
    title: "Hire an expert",
    blurb: "Embed a named Flutter, Next.js, or backend engineer in your squad.",
    href: "/services/technical-experts",
    icon: Users,
    accent: "from-amber-50 to-white border-amber-200/80 text-amber-700",
    event: "start_here_hire",
  },
  {
    title: "Not sure yet",
    blurb: "Send a short brief. We will tell you what we would (and would not) take.",
    href: "/#contact",
    icon: HelpCircle,
    accent: "from-teal-50 to-white border-teal-200/80 text-teal-700",
    event: "start_here_unsure",
  },
];

export default function StartHere() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 border-y border-slate-200/70 bg-white/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 mb-3">
            Start here
          </p>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-semibold text-slate-900 mb-3">
            Not sure which lane fits?
          </h2>
          <p className="text-slate-600 text-lg leading-8">
            Pick the closest path. One conversation sorts the rest.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paths.map((path, index) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
              >
                <Link
                  href={path.href}
                  onClick={() => track(path.event)}
                  className={`group h-full flex flex-col rounded-[1.5rem] border bg-gradient-to-br p-6 min-h-[13.5rem] transition-transform hover:-translate-y-1 ${path.accent}`}
                >
                  <Icon className="w-6 h-6 mb-5" />
                  <h3 className="font-display text-xl font-semibold text-slate-900 mb-2">
                    {path.title}
                  </h3>
                  <p className="text-slate-600 leading-7 flex-grow">{path.blurb}</p>
                  <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-slate-900">
                    Continue
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
